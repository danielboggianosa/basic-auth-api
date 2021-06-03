const bcrypt = require("bcrypt");
const env = require("../../infrastructure/config/environment");

module.exports = class PasswordSecurity {
  hashPass(password) {
    const salt = bcrypt.genSaltSync(15);
    return bcrypt.hashSync(password, salt);
  }

  async compare(password, hashed) {
    if (!password || !hashed) return false;
    return await bcrypt.compareSync(password, hashed);
  }
};
