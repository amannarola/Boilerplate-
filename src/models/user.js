import DBOperation from '../services/database/database_operation';
import { logger, level } from '../config/logger';

// TO-DO create separate file for schema
// mongoose schema
const schema = {
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  firstname: {
    type: String,
    trim: true
  },
  lastname: {
    type: String,
    trim: true
  },
  mob_number: { type: String, trim: true },
  username: {
    type: String,
    trim: true
  },
  access_token: {
    type: String,
    trim: true
  },
  password: { type: String, trim: true },
  verification_token: String,
  verify: { type: Boolean, default: false },
  password_reset_token: String,
  business_name: {
    type: String,
    trim: true
  },
  age: Number,
  business_logo: String,
  ip: String,
  device_type: String,
  os_type: String,
  picture: String,
  oauth_provider: String,
  wallet: {
    type: Number,
    default: 500
  }
};
const modelName = 'User';
let UserModel = DBOperation.createModel(modelName, schema);
class User {
  async add(user) {
    return new Promise((resolve, reject) => {
      try {
        const addedUser = Promise.resolve(DBOperation.create(UserModel, user));
        resolve(addedUser);
      } catch (err) {
        reject(err);
      }
    });
  }
  async getAll(option) {
    return new Promise((resolve, reject) => {
      try {
        const allUser = Promise.resolve(DBOperation.get(UserModel, {}, option));
        resolve(allUser);
      } catch (err) {
        reject(err);
      }
    });
  }
  async get(filter, option) {
    return new Promise((resolve, reject) => {
      try {
        const user = Promise.resolve(
          DBOperation.get(UserModel, filter, option)
        );
        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  }
  async isExist(filter, option) {
    let isExist = false;
    try {
      const user = await DBOperation.get(UserModel, filter, option);
      if (user.length > 0) {
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
        const updatedUser = Promise.resolve(
          DBOperation.update(UserModel, filter, updatedField)
        );
        resolve(updatedUser);
      } catch (err) {
        reject(err);
      }
    });
  }
  async delete(filter) {
    return new Promise((resolve, reject) => {
      try {
        const deletedUser = Promise.resolve(
          DBOperation.delete(UserModel, filter)
        );
        resolve(deletedUser);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default User;
