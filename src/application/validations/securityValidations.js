const TokenSecurity = require("../security/tokenSecurity");
const tokenSecurity = new TokenSecurity();
const Exception = require("../middlewares/exceptionMiddleware");

module.exports = class SecurityValidations {
  constructor({ roleRepository }) {
    this.roleRepository = roleRepository;
  }
  async authentication(req, res, next) {
    const token = req.headers.authorization.split("Bearer ")[1];
    if (!token) next(new Exception("UNAUTHORIZED", "Invalid token"));
    const isAuthenticated = await tokenSecurity.validate(token);
    if (isAuthenticated) {
      req._user = await tokenSecurity.payload(token);
      next();
    } else next(new Exception("UNAUTHORIZED", "User is not authorized"));
  }

  isAllowed(permissions, entity, capability) {
    for (let i = 0; i < permissions.length; i++) {
      const p = permissions[i];
      if (p.entity.name == entity && p[capability]) return true;
    }
    return false;
  }

  canReadAll(Entity) {
    return async (req, res, next) => {
      const role = await this.roleRepository.getRoleById(req._user.role);
      const { permissions } = role;
      if (this.isAllowed(permissions, Entity, "readAll")) next();
      else
        next(
          new Exception("UNAUTHORIZED", "Not authorized to read this entity")
        );
    };
  }

  canRead(Entity) {
    return async (req, res, next) => {
      const role = await this.roleRepository.getRoleById(req._user.role);
      const { permissions } = role;
      if (permissions.read) next();
      else
        next(
          new Exception("UNAUTHORIZED", "Not authorized to read this entity")
        );
    };
  }
};
