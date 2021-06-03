const PasswordSecurity = require("../security/passwordSecurity");
const passwordSecurity = new PasswordSecurity();
const Exception = require("../middlewares/exceptionMiddleware")

module.exports = class UserValidations {
  async registerOne(req, res, next) {
    const { firstName, email, username, password, image } = req.body;
    if (!firstName || !email || !username || !password) {
      next(
        new Exception(
          "BAD_REQUEST",
          "None of the required fields ('firstName', 'email', 'username', 'password') can be null or empty"
        )
      );
    }
    req.body.password = await passwordSecurity.hashPass(password);
    next();
  }

  async getAll(req, res, next) {}

  async getById(req, res, next) {}

  async getByEmail(req, res, next) {}

  async registerMany(req, res, next) {
    for (let i = 0; i < req.body.length; i++) {
      const user = req.body[i];
      req.body[i].password = await passwordSecurity.hashPass(user.password);
    }
    next();
  }
};
