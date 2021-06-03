const { Sequelize } = require("sequelize");
const env = require("./environment");

module.exports = class MongolDb {
  sequelize;
  config = {
    host: env.db.host,
    dialect: env.db.dialect,
    username: env.db.user,
    password: env.db.pass,
    database: env.db.name,
    timezone: env.db_time,
    logging: env.logging,
  };
  constructor() {
    this.sequelize = new Sequelize(this.config);
  }
}