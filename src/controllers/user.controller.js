import HTTPStatus from 'http-status';
import JWTAuth from '../services/jwt_auth/jwt_auth';
import { logger, level } from '../config/logger';
import User from '../models/user';
import { constants as APP_CONST } from '../constant/application';
import { constants as EMAIL_CONST } from '../constant/email';
import {
  redirectRequest,
  sendJSONResponse,
  createSuccessResponseJSON,
  createErrorResponseJSON,
  encrypt,
  decrypt,
  sendEmail
} from '../utils/utility';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { validationResult } from 'express-validator';

const user = new User();
const REDIRECT_URL = APP_CONST.ADMIN_UI_URL;
// TO-DO add another file if need to add more const
const userName = 'SHM';
const updatedUserName = 'SHM-V1';
const filterUser = { name: userName };
const updatedField = { name: updatedUserName };
const ACCESS_TOKEN = 'access_token';
const ERROR_500_MESSAGE = '500_MESSAGE';
const OFFSET = 'offset';
const LIMIT = 'limit';
const NEXT_OFFSET = 'nextOffset';

export const account = async (req, res) => {
  const user = req.user ? req.user : {};
  const email = user.email;
  let response, code;

  try {
    const auth = new JWTAuth();
    const accessToken = await auth.createToken(email);
    logger.log(level.debug, `jwt token ${accessToken}`);
    const redirectURLWithAcessToken =
      REDIRECT_URL + `?${ACCESS_TOKEN}=${accessToken}`;
    return redirectRequest(res, redirectURLWithAcessToken);
  } catch (e) {
    logger.log(level.error, `error ${e}`);
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createErrorResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
    return sendJSONResponse(res, code, response);
  }
};

export const addUser = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.debug, `addUser body=${JSON.stringify(req.body)}`);
  let code, response;
  let { username, email, password, confirmPassword, age } = req.body;
  try {
    if (!errors.isEmpty()) {
      const error = errors.array()[0].msg;
      code = HTTPStatus.BAD_REQUEST;
      response = createErrorResponseJSON(1, error);
    } else {
      const isUsernameExist = await user.isExist({
        username
      });
      if (!isUsernameExist) {
        const isEmailExist = await user.isExist({
          email
        });
        if (!isEmailExist) {
          if (password === confirmPassword) {
            const encryptPassword = encrypt(password);
            const verificationToken = crypto.randomBytes(3).toString('hex');
            const insertedUser = await user.add({
              username,
              email,
              password: encryptPassword,
              age,
              verification_token: verificationToken
            });
            await sendMailToUser(email, insertedUser);
            logger.log(level.debug, `inserted user=${insertedUser}`);
            const auth = new JWTAuth();
            const tokenPayload = {
              id: insertedUser._id,
              email: insertedUser.email
            };
            const accessToken = await auth.createToken(tokenPayload);
            logger.log(
              level.debug,
              `successfull addUser email=${email} jwt token=${accessToken}`
            );
            const data = {
              ...tokenPayload,
              accessToken
            };
            code = HTTPStatus.OK;
            response = createSuccessResponseJSON(0, data);
          } else {
            const error = 'Your password does not match';
            code = HTTPStatus.BAD_REQUEST;
            response = createErrorResponseJSON(2, error);
          }
        } else {
          code = HTTPStatus.BAD_REQUEST;
          response = createErrorResponseJSON(
            2,
            'This email is already registered'
          );
        }
      } else {
        code = HTTPStatus.BAD_REQUEST;
        response = createErrorResponseJSON(3, 'This username is already taken');
      }
    }
  } catch (e) {
    logger.log(level.error, `addUser error=${e}`);
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createErrorResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
  }
  return sendJSONResponse(res, code, response);
};

export const verifyUser = async (req, res) => {
  logger.log(level.debug, `verifyUser params=${JSON.stringify(req.params)}`);
  let code, response;
  try {
    const verificationToken = req.params.token;
    const tokenFilter = { verification_token: verificationToken };
    const [userDoc] = await user.get(tokenFilter, {});
    if (userDoc) {
      if (userDoc.verification_token == verificationToken) {
        const newVerificationToken = crypto.randomBytes(3).toString('hex');
        const updateUserField = {
          verification_token: newVerificationToken,
          verify: true
        };
        const updatedUser = await user.update(
          { email: userDoc.email },
          updateUserField
        );
        sendWelcomeMailToUser(updatedUser);
        logger.log(
          level.debug,
          `verifyUser successfully email=${updatedUser.email}`
        );

        const redirectToSignIn = APP_CONST.ADMIN_UI_URL + '/sign_in';
        console.log(redirectToSignIn);
        // return redirectRequest(res, redirectToSignIn);
        code = HTTPStatus.OK;
        response = createSuccessResponseJSON(
          0,
          'Your email has been successfully verified. Please login to your account.'
        );
      } else {
        code = HTTPStatus.BAD_REQUEST;
        response = createErrorResponseJSON(
          7,
          'Verification token is not matched.'
        );
      }
    } else {
      code = HTTPStatus.BAD_REQUEST;
      response = createErrorResponseJSON(6, 'Verification token is not valid.');
    }
  } catch (error) {
    logger.log(level.error, error);
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createErrorResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
  }
  return sendJSONResponse(res, code, response);
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  let response, code;

  try {
    if (!errors.isEmpty()) {
      const error = errors.array()[0].msg;
      code = HTTPStatus.BAD_REQUEST;
      response = createErrorResponseJSON(1, error);
    } else {
      const [userDoc] = await user.get(
        {
          email
        },
        {}
      );
      if (userDoc) {
        if (userDoc.oauth_provider == 'google') {
          code = HTTPStatus.BAD_REQUEST;
          response = createErrorResponseJSON(1, 'Please login with google');
          return sendJSONResponse(res, code, response);
        }
        if (userDoc.verify == false) {
          code = HTTPStatus.BAD_REQUEST;
          response = createErrorResponseJSON(1, 'Please confirm your email.');
          return sendJSONResponse(res, code, response);
        }
        const decryptPassword = decrypt(userDoc.password);
        if (password == decryptPassword) {
          const tokenPayload = {
            id: userDoc._id,
            email: userDoc.email
          };
          const auth = new JWTAuth();
          const accessToken = await auth.createToken(tokenPayload);
          logger.log(
            level.debug,
            `successfull login email=${email} jwt token=${accessToken}`
          );
          code = HTTPStatus.OK;
          const data = {
            ...tokenPayload,
            accessToken
          };
          console.log(data);
          response = createSuccessResponseJSON(0, data);
        } else {
          code = HTTPStatus.BAD_REQUEST;
          response = createErrorResponseJSON(5, 'Incorrect email or password.');
        }
      } else {
        code = HTTPStatus.BAD_REQUEST;
        response = createErrorResponseJSON(
          1,
          'This User does not belong to any account'
        );
      }
    }
  } catch (e) {
    logger.log(level.error, `login error ${e}`);
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createErrorResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
  }
  return sendJSONResponse(res, code, response);
};

export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.debug, `forgotPassword ${JSON.stringify(req.params)}`);
  let code, response;
  const { email } = req.params;
  let passwordResetURL = APP_CONST.ADMIN_UI_URL;
  try {
    if (!errors.isEmpty()) {
      const error = errors.array()[0].msg;
      code = HTTPStatus.BAD_REQUEST;
      response = createErrorResponseJSON(1, error);
    } else {
      const token = crypto.randomBytes(3).toString('hex');
      const [userDoc] = await user.get({ email }, {});
      if (userDoc) {
        const updateToken = { password_reset_token: token };
        const updatedUser = await user.update({ email }, updateToken);
        logger.log(
          level.debug,
          `forgotPassword token saved updatedUser=${updatedUser}`
        );
        const from = EMAIL_CONST.FROM;
        const to = email;
        const subject = 'Reset Your Password';
        const text = 'Reset Your Password';
        let html = await fs.readFileSync(
          path.resolve('./src/email_template/forgot_password.html'),
          'utf8'
        );
        let result = html.replace(/USER_FIRSTNAME/g, updatedUser.firstname);
        passwordResetURL += '/reset-password?token=' + token;
        logger.log(
          level.debug,
          `forgotPassword passwordResetURL=${passwordResetURL}`
        );
        result = result.replace(/FORGOT_PASSWORD_LINK/g, passwordResetURL);
        sendEmail(to, from, subject, text, result);
        code = HTTPStatus.OK;
        const data =
          'Confirmation Token has been sent to your E-Mail. Please click on the link to confirm your password reset.';
        response = createSuccessResponseJSON(0, data);
      } else {
        code = HTTPStatus.INTERNAL_SERVER_ERROR;
        response = createErrorResponseJSON(
          1,
          'There is no account registered with this E-Mail.'
        );
      }
    }
  } catch (e) {
    logger.log(level.error, `forgotPassword ${JSON.stringify(req.params)}`);
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createErrorResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
  }
  return sendJSONResponse(res, code, response);
};

// export const passwordReset = async (req, res) => {
//   logger.log(level.debug, `passwordReset ${JSON.stringify(req.params)}`);
//   const { email, token } = req.params;
//   logger.log(level.debug, `passwordReset email=${email}, token=${token}`);
//   return res.sendFile(path.resolve('./src/public/reset_password.html'));
// };

export const changePassword = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.debug, `>> changePassword `);
  let code, response;
  const { newPassword, confirmPassword, token } = req.body;
  try {
    if (!errors.isEmpty()) {
      const error = errors.array()[0].msg;
      code = HTTPStatus.BAD_REQUEST;
      response = createErrorResponseJSON(1, error);
    } else {
      if (newPassword === confirmPassword) {
        logger.log(level.debug, `changePassword token=${token}`);
        const tokenFilter = { password_reset_token: token };
        const [userDoc] = await user.get(tokenFilter, {});
        if (userDoc) {
          if (userDoc.password_reset_token === token) {
            const encryptPassword = encrypt(newPassword);
            const updatedToken = crypto.randomBytes(3).toString('hex');
            const updatePassword = {
              password: encryptPassword,
              password_reset_token: updatedToken
            };
            const updatedUser = await user.update(
              { email: userDoc.email },
              updatePassword
            );
            logger.log(
              level.debug,
              `changePassword successfully changed password for email=${updatedUser.email},
               updatedToken=${updatedUser.password_reset_token}`
            );

            code = HTTPStatus.OK;
            response = createSuccessResponseJSON(
              0,
              'Your password has been successfully changed. Please login your account.'
            );
          } else {
            code = HTTPStatus.BAD_REQUEST;
            response = createErrorResponseJSON(
              7,
              'Password reset token is not matched.'
            );
          }
        } else {
          code = HTTPStatus.BAD_REQUEST;
          response = createErrorResponseJSON(
            6,
            'Password reset token is not valid.'
          );
        }
      } else {
        code = HTTPStatus.BAD_REQUEST;
        response = createErrorResponseJSON(4, 'Your password does not match');
      }
    }
  } catch (e) {
    logger.log(level.error, `changePassword ${JSON.stringify(req.params)}`);
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createErrorResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
  }
  return sendJSONResponse(res, code, response);
};

export const getUser = async (req, res) => {
  let code, response;
  try {
    const body = req.body || {};
    const offset = body.offset ? body.offset : 3;
    const limit = body.limit ? body.limit : 2;
    let option = {};
    option[OFFSET] = offset;
    option[LIMIT] = limit;
    const allUser = await user.getAll(option);
    let data = {};
    if (allUser.length > 0) {
      data[NEXT_OFFSET] = offset + limit;
    }
    data.users = allUser;
    logger.log(level.debug, `retrive all user=${data}`);
    code = HTTPStatus.OK;
    response = createSuccessResponseJSON(0, data);
  } catch (e) {
    logger.log(level.error, e);
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createSuccessResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
  }
  return sendJSONResponse(res, code, response);
};

export const getUserByFilter = async (req, res) => {
  let code, response;
  try {
    const filteredUser = await user.get(filterUser, {});
    logger.log(
      level.debug,
      `retrive user=${JSON.stringify(
        filteredUser,
        0,
        4
      )} filter by ${JSON.stringify(filterUser)}`
    );
    code = HTTPStatus.OK;
    response = createSuccessResponseJSON(0, filteredUser);
  } catch (e) {
    logger.log(level.error, e);
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createErrorResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
  }
  return sendJSONResponse(res, code, response);
};

export const updateUser = async (req, res) => {
  let code, response;

  try {
    const updatedUser = await user.update(filterUser, updatedField);
    logger.log(
      level.debug,
      `updated user=${updatedUser} 
          filter by ${JSON.stringify(filterUser)} 
          updatedField=${JSON.stringify(updatedField)}`
    );
    code = HTTPStatus.OK;
    response = createSuccessResponseJSON(0, updatedUser);
  } catch (e) {
    logger.log(level.error, e);
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createErrorResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
  }
  return sendJSONResponse(res, code, response);
};

export const deleteUser = async (req, res) => {
  let code, response;
  try {
    const deletedUser = await user.delete(updatedField);
    logger.log(
      level.debug,
      `deleted user=${deletedUser} 
      filter by ${JSON.stringify(filterUser)}`
    );
    code = HTTPStatus.OK;
    response = createSuccessResponseJSON(0, deletedUser);
  } catch (e) {
    logger.log(level.error, e);
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createErrorResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
  }
  return sendJSONResponse(res, code, response);
};

const sendMailToUser = async (emailId, userData) => {
  if (!userData.verification_token) {
    logger.log(
      level.debug,
      `Verification Token is missing for user: ${emailId}`
    );
    return true;
  }
  const from = EMAIL_CONST.FROM;
  const to = emailId;
  const subject = 'User Verification';
  const text = 'User Verification';
  let emailVerificationURL = APP_CONST.HOST_URL;
  emailVerificationURL +=
    '/api/user/verify/token/' + userData.verification_token;
  let html = await fs.readFileSync(
    path.resolve('./src/email_template/user_verify.html'),
    'utf8'
  );
  let result = html.replace(/USER_FIRSTNAME/g, userData.firstname);
  result = result.replace(/VERIFY_EMAIL_LINK/g, emailVerificationURL);
  sendEmail(to, from, subject, text, result);
  logger.log(level.debug, `Email sent successfully to user email: ${emailId}`);
  return true;
};

const sendWelcomeMailToUser = async user => {
  const from = EMAIL_CONST.FROM;
  const to = user.email;
  const subject = 'Welcome to APP';
  const text = 'Welcome to APP';
  let html = await fs.readFileSync(
    path.resolve('./src/email_template/welcome_email.html'),
    'utf8'
  );
  let result = html.replace(/USER_FIRSTNAME/g, user.firstname);
  sendEmail(to, from, subject, text, result);
  logger.log(
    level.debug,
    `Email sent successfully to user: ${user._id} for email: ${user.email}`
  );
  return true;
};
