require("dotenv").config();
const environment = process.env.ENVIRONMENT == "development" ? true : false;
module.exports = {
  app: {
    port: process.env.APP_PORT,
    salt: process.env.APP_SALT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    exp: process.env.JWT_EXP,
  },
  logging: environment,
  db: {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
    time: process.env.DB_TIME,
    dialect: process.env.DB_DIALECT,
  },
  models: {
    users: process.env.USERS_TABLE,
    roles: process.env.ROLES_TABLE,
    entities: process.env.ENTITIES_TABLE,
    permissions: process.env.PERMISSIONS_TABLE,
    rolePermissions: process.env.ROLE_PERMISSIONS_TABLE,
    userRoles: process.env.USER_ROLES_TABLE,
  },
};
