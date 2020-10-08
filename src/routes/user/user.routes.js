/**
 * User Routes
 */

import { Router } from 'express';
import {
  login,
  addUser,
  account,
  verifyUser,
  forgotPassword,
  changePassword,
  getUser,
  updateUser,
  deleteUser
} from '../../controllers/user.controller';
import { validate } from '../../validator/user.validator';
import { constants as VALIDATOR } from '../../constant/validator/user';

const routes = new Router();
const PATH = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_EMAIL: '/verify/token/:token',
  FORGOT_PASSWORD: '/forgot_password/email/:email',
  CHANGE_PASSWORD: '/change_password',
  ACCOUNT: '/account',
  SETTINGS: '/settings',
  FILTER: '/filter',
  PROFILE: '/profile',
  ROOT: '/'
};

routes.get(PATH.ACCOUNT, account);

routes.post(PATH.LOGIN, validate(VALIDATOR.LOGIN), login);
routes.post(PATH.SIGNUP, validate(VALIDATOR.ADD_USER), addUser);
routes.get(PATH.VERIFY_EMAIL, verifyUser);
routes.get(
  PATH.FORGOT_PASSWORD,
  validate(VALIDATOR.FORGOT_PASSWORD),
  forgotPassword
);
routes.post(
  PATH.CHANGE_PASSWORD,
  validate(VALIDATOR.CHANGE_PASSWORD),
  changePassword
);

routes.get(PATH.ROOT, getUser);
routes.put(PATH.ROOT, updateUser);
routes.delete(PATH.ROOT, deleteUser);

export default routes;
