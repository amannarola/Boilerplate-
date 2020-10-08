import HTTPStatus from 'http-status';
import { logger, level } from '../config/logger';

import Config from '../models/config';
const configModel = new Config();
import {
  sendJSONResponse,
  createSuccessResponseJSON,
  createErrorResponseJSON
} from '../utils/utility';

// TO-DO add another file if need to add more const
const ERROR_500_MESSAGE = '500_MESSAGE';

export const addConfig = async (req, res) => {
  logger.log(level.debug, `addConfig body=${JSON.stringify(req.body)}`);
  const { daily_wallet_limit } = req.body;
  let response, code;
  try {
    let configDoc = await configModel.get({});
    if (configDoc && configDoc.length == 0) {
      configDoc = await configModel.add({ daily_wallet_limit });
      logger.log(
        level.debug,
        `addConfig configDoc=${JSON.stringify(configDoc)}`
      );
      code = HTTPStatus.OK;
      const data = configDoc;
      response = createSuccessResponseJSON(0, data);
    } else {
      logger.log(
        level.debug,
        `addConfig already exist configDoc=${JSON.stringify(configDoc)}`
      );
      code = HTTPStatus.OK;
      const data = configDoc;
      response = createSuccessResponseJSON(0, data);
    }
  } catch (err) {
    logger.log(level.error, `addConfig err=${err}`);
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createErrorResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
  }
  return sendJSONResponse(res, code, response);
};

export const getConfig = async (req, res) => {
  logger.log(level.debug, `getConfig params=${JSON.stringify(req.params)}`);
  let response, code;
  try {
    const configDoc = await configModel.get({});
    logger.log(level.debug, `getConfig configDoc=${JSON.stringify(configDoc)}`);
    code = HTTPStatus.OK;
    const data = configDoc;
    response = createSuccessResponseJSON(0, data);
  } catch (err) {
    logger.log(level.error, `getConfig err=${err}`);
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createErrorResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
  }
  return sendJSONResponse(res, code, response);
};

export const updateConfig = async (req, res) => {
  logger.log(
    level.debug,
    `updateConfig params=${JSON.stringify(req.params)},
       body=${JSON.stringify(req.body)}`
  );
  const { daily_wallet_limit } = req.body;
  const { config_id } = req.params;
  let response, code;
  try {
    const configDoc = await configModel.update(
      { _id: config_id },
      { daily_wallet_limit }
    );
    logger.log(
      level.debug,
      `updateConfig configDoc=${JSON.stringify(configDoc)}`
    );
    code = HTTPStatus.OK;
    const data = configDoc;
    response = createSuccessResponseJSON(0, data);
  } catch (err) {
    logger.log(level.error, `updateConfig err=${err}`);
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createErrorResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
  }
  return sendJSONResponse(res, code, response);
};

export const deleteConfig = async (req, res) => {
  logger.log(level.debug, `deleteConfig params=${JSON.stringify(req.params)}`);
  const { config_id } = req.params;
  let response, code;
  try {
    const configDoc = await configModel.delete({ _id: config_id });
    logger.log(
      level.debug,
      `deleteConfig configDoc=${JSON.stringify(configDoc)}`
    );
    code = HTTPStatus.OK;
    const data = configDoc;
    response = createSuccessResponseJSON(0, data);
  } catch (err) {
    logger.log(level.error, `deleteConfig err=${err}`);
    code = HTTPStatus.INTERNAL_SERVER_ERROR;
    response = createErrorResponseJSON(1, HTTPStatus[ERROR_500_MESSAGE]);
  }
  return sendJSONResponse(res, code, response);
};
