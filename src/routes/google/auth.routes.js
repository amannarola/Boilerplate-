/**
 * Facebook Auth Routes
 */

import { Router } from 'express';
import {
  requireGoogleLogin,
  authGoogle,
  authGoogleRedirect
} from '../../services/google/login';
import { constants as GOOGLE_ROUTES_CONST } from '../../constant/google/routes';
import { redirectRequest } from '../../utils/utility';

const routes = new Router();
const REDIRECT_URL = '/api/user/account';

routes.get(
  GOOGLE_ROUTES_CONST.AUTH,
  requireGoogleLogin,
  authGoogle,
  (_req, _res) => {
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  }
);

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
routes.get(GOOGLE_ROUTES_CONST.AUTH_CALLBACK, authGoogleRedirect, (_, res) => {
  redirectRequest(res, REDIRECT_URL);
});

export default routes;
