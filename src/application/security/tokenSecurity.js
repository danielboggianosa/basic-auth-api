const jwt = require("jsonwebtoken");
const env = require("../../infrastructure/config/environment");
const Exception = require("../middlewares/exceptionMiddleware");

module.exports = class TokenSecurity {
  constructor() {
    this.secret = env.jwt.secret;
    this.exp = env.jwt.exp;
  }
  async generate(data) {
    const token = await jwt.sign(data, this.secret, { expiresIn: this.exp });
    if (token) return token;
    else throw new Exception("INTERNAL_SERVER_ERROR", "Token was not created");
  }
  async validate(token) {
    const isValid = await jwt.verify(token, this.secret, (err, result) => {
      if (err) return false;
      else return result;
    });
    return isValid;
  }
  async payload(token) {
    const { id, firstName, lastName, email, username, role } = await jwt.decode(
      token
    );
    return { id, firstName, lastName, email, username, role };
  }
};
