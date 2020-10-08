import request from 'request-promise';
import { logger, level } from '../../config/logger';

// HTTP class for get,post,put,delete call
class HTTP {
  async post(url, requestBody, option) {
    const POST = 'post';
    return new Promise((resolve, reject) => {
      try {
        const result = Promise.resolve(
          request({
            uri: url,
            qs: option.qs,
            method: POST,
            json: requestBody
          })
        );
        resolve(result.body);
      } catch (err) {
        logger.log(level.error, err);
        reject(err);
      }
    });
  }

  async get(url, option) {
    return new Promise((resolve, reject) => {
      const GET = 'get';
      const options = {
        uri: url,
        qs: option && option.qs ? option.qs : '',
        method: GET
      };
      try {
        let result = Promise.resolve(request.get(options));
        resolve(result);
      } catch (err) {
        logger.log(level.error, err);
        reject(err);
      }
    });
  }

  async put(url, requestBody, option) {
    const PUT = 'put';
    return new Promise((resolve, reject) => {
      try {
        const result = Promise.resolve(
          request({
            uri: url,
            qs: option.qs,
            method: PUT,
            json: requestBody
          })
        );
        resolve(result.body);
      } catch (err) {
        logger.log(level.error, err);
        reject(err);
      }
    });
  }

  async delete(url, option) {
    const DELETE = 'delete';
    return new Promise((resolve, reject) => {
      try {
        const result = Promise.resolve(
          request({
            uri: url,
            qs: option.qs,
            method: DELETE
          })
        );
        resolve(result.body);
      } catch (err) {
        logger.log(level.error, err);
        reject(err);
      }
    });
  }
}
export default HTTP;
