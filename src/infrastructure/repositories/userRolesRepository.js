"use strict";
const env = require("../config/environment");
const Exception = require("../../application/middlewares/exceptionMiddleware");

module.exports = class UserRolesRepository {
  constructor(database, DataTypes) {
    this.attributes = {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: "users", key: "id" },
      },
      roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: "roles", key: "id" },
      },
    };
    this.tableName = env.models.userRoles;
    this.options = { tableName: this.tableName };
    this.model = database.define("UserRoles", this.attributes, this.options);
  }

  async createDefaults() {
    await this.model.findOrCreate({ where: { userId: 1, roleId: 1 } });
  }

  async addRole(userId, roleId) {
    const data = await this.model.create({ userId, roleId });
    if (data) return data;
    else throw new Exception("BAD_REQUEST", "Assignation not possible");
  }
};
