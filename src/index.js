import httpContext from 'express-http-context';
import './config/database';
import middlewaresConfig from './config/middlewares';
import { logger, level } from './config/logger';
import express from 'express';
import { constants as APP_CONST } from './constant/application';
import ApiRoutes from './routes';
const app = express();
const PATH = {
  API: '/api'
};
app.set('view engine', 'pug');
// Wrap all the middlewares with the server
middlewaresConfig(app);
app.use(httpContext.middleware);
// Add the apiRoutes stack to the server
app.use(PATH.API, ApiRoutes);

app.listen(APP_CONST.PORT, err => {
  if (err) {
    logger.log(level.error, `Cannot run due to ${err}!`);
  } else {
    logger.log(level.info, `server started on port ${APP_CONST.PORT}`);
  }
});

export default app;
