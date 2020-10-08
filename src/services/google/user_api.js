import HTTP from '../http/http';
const http = new HTTP();
import { constants as API_CONST } from '../../constant/google/api';
import { logger, level } from '../../config/logger';

class UserAPI {
  async getMe(access_token) {
    logger.log(level.debug, `getMe access_token=${access_token}`);
    let resp = {};
    const url = API_CONST.GOOGLE_PLUS_PEOPLE_URL + API_CONST.ME;
    const option = {};
    option.qs = { access_token };
    try {
      resp = await http.get(url, option);
    } catch (e) {
      logger.log(level.error, e);
    }
    logger.log(
      level.info,
      `getMe access_token=${access_token},
      resp=${JSON.stringify(resp)}`
    );
    return resp;
  }
}

export default UserAPI;
