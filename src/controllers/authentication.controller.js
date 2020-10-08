import httpContext from 'express-http-context';
import { logger, level } from '../config/logger';
import JWTAuth from '../services/jwt_auth/jwt_auth';
import HTTPStatus from 'http-status';
import { sendJSONResponse, createErrorResponseJSON } from '../utils/utility';

const auth = new JWTAuth();
const tokenLength = 2;
const tokenSplitBy = ' ';
const AUTHORIZATION_HEADER_NAME = 'authorization';
const CURRENT_USER = 'currentUser';

export const authMiddleware = async (req, res, next) => {
  const authorization = req.headers[AUTHORIZATION_HEADER_NAME];
  if (authorization) {
    let token = authorization.split(tokenSplitBy);
    let length = token.length;
    if (length == tokenLength) {
      let accessToken = token[1];
      try {
        let decoded = await auth.verifyToken(accessToken);
        logger.log(
          level.debug,
          `authMiddleware decoded=${JSON.stringify(decoded)}`
        );
        const email = decoded.email;
        httpContext.set('email', email);
        /* eslint-disable require-atomic-updates */
        req[CURRENT_USER] = email;
        next();
        return;
      } catch (e) {
        logger.log(level.error, `authMiddleware ${e}`);
      }
    }
  }
  let code = HTTPStatus.UNAUTHORIZED;
  let response = createErrorResponseJSON(1, HTTPStatus['401_MESSAGE']);
  sendJSONResponse(res, code, response);
};
