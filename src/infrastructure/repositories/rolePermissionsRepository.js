"use strict";
const env = require("../config/environment");
const Exception = require("../../application/middlewares/exceptionMiddleware");

module.exports = class RolePermissionsRepository {
  constructor(database, DataTypes) {
    this.attributes = {
      roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      permissionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
    };
    this.tableName = env.models.rolePermissions;
    this.options = { tableName: this.tableName };
    this.model = database.define(
      "RoleEntitiesPermissions",
      this.attributes,
      this.options
    );
  }

  async addPermission(roleId, permissionId) {
    const data = await this.model.create({ roleId, permissionId });
    return data;
  }
};
