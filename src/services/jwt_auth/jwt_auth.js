import jwt from "jsonwebtoken";
import { constants as JWT_CONST } from "../../constant/jwt_auth";
const SECRET = JWT_CONST.JWT_AUTH_SECRET;

class JWTAuth {
  async createToken(email) {
    return new Promise((resolve, reject) => {
      const payload = { email: email };
      try {
        const token = Promise.resolve(jwt.sign(payload, SECRET));
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }

  async verifyToken(accessToken) {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.verify(accessToken, SECRET);
        resolve(decoded);
      } catch (err) {
        reject(err);
      }
    });
  }
}
export default JWTAuth;
