import DBOperation from '../services/database/database_operation';
import { logger, level } from '../config/logger';

// TO-DO create separate file for schema
// mongoose schema
const schema = {
  daily_wallet_limit: Number
};
const modelName = 'Config';
let ConfigModel = DBOperation.createModel(modelName, schema);
class Config {
  async add(config) {
    return new Promise((resolve, reject) => {
      try {
        const addedConfig = Promise.resolve(
          DBOperation.create(ConfigModel, config)
        );
        resolve(addedConfig);
      } catch (err) {
        reject(err);
      }
    });
  }
  async getAll(option) {
    return new Promise((resolve, reject) => {
      try {
        const allConfig = Promise.resolve(
          DBOperation.get(ConfigModel, {}, option)
        );
        resolve(allConfig);
      } catch (err) {
        reject(err);
      }
    });
  }
  async get(filter, option) {
    return new Promise((resolve, reject) => {
      try {
        const config = Promise.resolve(
          DBOperation.get(ConfigModel, filter, option)
        );
        resolve(config);
      } catch (err) {
        reject(err);
      }
    });
  }
  async isExist(filter, option) {
    let isExist = false;
    try {
      const config = await DBOperation.get(ConfigModel, filter, option);
      if (config.length > 0) {
        isExist = true;
      }
    } catch (err) {
      logger.log(level.error, err);
    }
    return isExist;
  }
  async update(filter, updatedField) {
    return new Promise((resolve, reject) => {
      try {
        const updatedConfig = Promise.resolve(
          DBOperation.update(ConfigModel, filter, updatedField)
        );
        resolve(updatedConfig);
      } catch (err) {
        reject(err);
      }
    });
  }
  async delete(filter) {
    return new Promise((resolve, reject) => {
      try {
        const deletedConfig = Promise.resolve(
          DBOperation.delete(ConfigModel, filter)
        );
        resolve(deletedConfig);
      } catch (err) {
        reject(err);
      }
    });
  }

  async deleteMultiple(filter) {
    return new Promise((resolve, reject) => {
      try {
        const deletedConfig = Promise.resolve(
          DBOperation.deleteMultiple(ConfigModel, filter)
        );
        resolve(deletedConfig);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default Config;
