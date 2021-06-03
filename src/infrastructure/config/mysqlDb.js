const { Sequelize, DataTypes } = require("sequelize");
const env = require("./environment");

const config = {
  host: env.db.host,
  username: env.db.user,
  password: env.db.pass,
  database: env.db.name,
  timezone: env.db.time,
  logging: env.logging,
  dialect: env.db.dialect,
};
const database = new Sequelize(config);
module.exports = { database, DataTypes };
