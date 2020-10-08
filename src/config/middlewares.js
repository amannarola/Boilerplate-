/**
 * Configuration of the server middlewares.
 */

import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';
import cors from 'cors';
const MORGAN_DEV_FORMAT = 'dev';
// const MORGAN_COMBINE_FORMAT = "combined";

export default app => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(morgan(MORGAN_DEV_FORMAT));
};
