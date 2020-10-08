import { Schema, model } from 'mongoose';
import { logger, level } from '../../config/logger';
import { plugin } from 'mongoose-auto-increment';

const timestamps = { createdAt: 'created_at', updatedAt: 'updated_at' };
// database class for crud operation

class DatabaseOperation {
  // create monogoDB model
  createModel(modelName, schema) {
    try {
      const newSchema = new Schema(schema, { timestamps });
      newSchema.plugin(plugin, {
        model: modelName,
        field: '_id',
        startAt: 1,
        incrementBy: 1
      });
      return model(modelName, newSchema);
    } catch (e) {
      logger.log(level.error, e);
    }
  }

  async getModel(_modelName) {}

  // create new document
  async create(modelClass, obj) {
    // async create(model) {
    const model = new modelClass(obj);
    return new Promise((resolve, reject) => {
      try {
        const data = Promise.resolve(model.save());
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // retrive document
  async get(modelClass, obj, option) {
    return new Promise((resolve, reject) => {
      const opArgs = {};
      option && option.offset ? (opArgs.skip = option.offset) : '';
      option && option.limit ? (opArgs.limit = option.limit) : '';
      option && option.sort ? (opArgs.sort = option.sort) : '';
      try {
        const data = Promise.resolve(modelClass.find(obj, null, opArgs));
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // update document
  async update(modelClass, filter, updatedField) {
    const option = {
      new: true, // return updated doc
      runValidators: true, // validate before update
      omitUndefined: true
    };
    return new Promise((resolve, reject) => {
      try {
        const data = Promise.resolve(
          modelClass.findOneAndUpdate(filter, updatedField, option)
        );
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // delete document
  async delete(modelClass, filter) {
    return new Promise((resolve, reject) => {
      try {
        const data = Promise.resolve(modelClass.findOneAndRemove(filter));
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  async deleteMultiple(modelClass, filter) {
    return new Promise((resolve, reject) => {
      try {
        const data = Promise.resolve(modelClass.deleteMany(filter));
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }
}
export default new DatabaseOperation();
