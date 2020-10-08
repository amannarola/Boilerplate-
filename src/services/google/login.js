import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import JWTAuth from '../jwt_auth/jwt_auth';
import HTTPStatus from 'http-status';
import { logger, level } from '../../config/logger';
import { constants as API_URL_CONST } from '../../constant/api_url';
// import { constants as GOOGLE_API_CONST } from '../../constant/google/api';
import { constants as GOOGLE_CRED_CONST } from '../../constant/google/credential';
import {
  //   redirectRequest,
  sendJSONResponse,
  createErrorResponseJSON
} from '../../utils/utility';
import User from '../../models/user';
// import format from 'string-format';
const userModel = new User();
const EMAIL = 'email';
// const ACCESS_TOKEN = 'access_token';
const ERROR_500_MESSAGE = '500_MESSAGE';
// const REDIRECT_URL = API_URL_CONST.ADMIN_UI_URL;

const serializeUserFunction = (user, done) => {
  logger.log(level.info, `SerializeUser ${JSON.stringify(user)}`);
  done(null, user);
};

// passport setting
passport.serializeUser(serializeUserFunction);

const deserializeUserFunction = (obj, done) => {
  logger.log(level.info, `DeserializeUser ${JSON.stringify(obj)}`);
  done(null, obj);
};

passport.deserializeUser(deserializeUserFunction);

// const callbackURL = API_URL_CONST.HOST_URL + FB_CRED_CONST.CALLBACK_URL;
const callbackURL = API_URL_CONST.HOST_URL + GOOGLE_CRED_CONST.CALLBACK_URL;
const option = {
  clientID: GOOGLE_CRED_CONST.GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CRED_CONST.GOOGLE_CLIENT_SECRET,
  callbackURL
};

const verifyFunction = (token, tokenSecret, profile, done) => {
  process.nextTick(async () => {
    logger.log(
      level.debug,
      `verifyFunction ${JSON.stringify({ token, tokenSecret, profile })}`
    );
    try {
      let email = profile.emails[0].value;
      let picture = profile.photos[0].value;
      let { id, displayName, name } = profile;
      logger.log(level.debug, `${JSON.stringify({ id, displayName, name })}`);
      const GOOGLE_OAUTH = 'google';
      let user = {
        email,
        firstname: name.givenName,
        lastname: name.familyName,
        name: displayName,
        oauth_provider: GOOGLE_OAUTH,
        picture
      };

      const isUserExist = await userModel.isExist({ email });
      if (isUserExist) {
        const updatedUser = {
          firstname: name.givenName,
          lastname: name.familyName,
          name: displayName,
          picture
        };
        await userModel.update({ email }, updatedUser);
      } else {
        await userModel.add(user);
      }
      logger.log(level.info, `verifyFunction email=${JSON.stringify(email)}`);
      profile[EMAIL] = email;
    } catch (e) {
      logger.log(level.error, e);
    }
    return done(null, profile);
  });
};

const googleStrategy = new GoogleStrategy(option, verifyFunction);

passport.use(googleStrategy);

const requireGoogleLogin = async (req, res, next) => {
  logger.log(level.info, `requireGoogleLogin`);
  const fb_access_token = req.query.fb_access_token;
  if (fb_access_token) {
    try {
      let [accessTokenMatchedUser] = await userModel.get({ fb_access_token });
      if (accessTokenMatchedUser) {
        // const { email } = accessTokenMatchedUser;
        // const fb = new UserAPI();
        // let resp = await fb.debugUserAccessToken(fb_access_token);
        // let result = JSON.parse(resp);
        // const { is_valid, data_access_expires_at, expires_at } = result.data;
        // let currentTimestamp = Math.floor(new Date() / 1000);
        // TO-DO explore expiresAt property why it's 0?
        // logger.log(
        //   level.info,
        //   `authFacebook email=${email} isValid=${is_valid}
        //   currentTimestamp=${currentTimestamp}
        //   dataAccessExpireAt=${data_access_expires_at}
        //   expiresAt=${expires_at}
        //   Facebook Login Required=${!is_valid &&
        //     currentTimestamp > data_access_expires_at}
        // `
        // );
        // if (is_valid && currentTimestamp < data_access_expires_at) {
        //   const auth = new JWTAuth();
        //   const accessToken = await auth.createToken(email);
        //   logger.log(level.debug, `jwt token ${accessToken}`);
        //   const redirectURLWithAcessToken =
        //     REDIRECT_URL + `?${ACCESS_TOKEN}=${accessToken}`;
        //   return redirectRequest(res, redirectURLWithAcessToken);
        // }
      }
    } catch (e) {
      let response, code;
      logger.log(level.error, `error ${e}`);
      code = HTTPStatus.INTERNAL_SERVER_ERROR;
      response = createErrorResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
      return sendJSONResponse(res, code, response);
    }
  }
  next();
};

const authGoogle = passport.authenticate(GOOGLE_CRED_CONST.PROVIDER, {
  authType: 'reauthenticate', // If need to reauthenticate
  scope: GOOGLE_CRED_CONST.SCOPE,
  failureRedirect: GOOGLE_CRED_CONST.FAILURE_REDIRECT
});

const authGoogleRedirect = passport.authenticate(GOOGLE_CRED_CONST.PROVIDER, {
  failureRedirect: GOOGLE_CRED_CONST.FAILURE_REDIRECT
});

export { requireGoogleLogin, authGoogle, authGoogleRedirect };
