/**
 * API Routes
 */

import { Router } from 'express';
import { authMiddleware } from '../controllers/authentication.controller';
import GoogleAuthRoutes from './google/auth.routes';
import UserRoutes from './user/user.routes';
import ConfigRoutes from './config/config.routes';
import HTTPStatus from 'http-status';
const status = 'backend service is running';
const routes = new Router();
const PATH = {
  ROOT: '/',
  USER: '/user',
  CONFIG: '/config'
};
routes.get(PATH.ROOT, (_req, res) => {
  return res.status(HTTPStatus.OK).json({ status });
});
routes.use(PATH.USER, UserRoutes);
routes.use(PATH.ROOT, GoogleAuthRoutes);
routes.use(PATH.CONFIG, ConfigRoutes);
// Below this each route will be first check for authentication
routes.use(authMiddleware);

export default routes;
