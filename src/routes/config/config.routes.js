/**
 * User Routes
 */

import { Router } from 'express';
import {
  addConfig,
  getConfig,
  updateConfig,
  deleteConfig
} from '../../controllers/config.controller';

const routes = new Router();
const PATH = {
  ADD_CONFIG: '/add',
  GET_CONFIG: '/get',
  UPDATE_CONFIG: '/update/:config_id',
  DELETE_CONFIG: '/delete/:config_id'
};

routes.post(PATH.ADD_CONFIG, addConfig);
routes.get(PATH.GET_CONFIG, getConfig);
routes.put(PATH.UPDATE_CONFIG, updateConfig);
routes.delete(PATH.DELETE_CONFIG, deleteConfig);
export default routes;
