"use strict";
const env = require("../config/environment");
const Exception = require("../../application/middlewares/exceptionMiddleware");
const PermissionRepository = require("./permissionRepository");
const EntityRepository = require("./entityRepository");

module.exports = class RoleRepository {
  constructor(database, DataTypes) {
    this.Permission = new PermissionRepository(database, DataTypes);
    this.Entity = new EntityRepository(database, DataTypes);
    this.attributes = {
      name: { type: DataTypes.STRING, allowNull: false },
      level: { type: DataTypes.INTEGER, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      createdBy: { type: DataTypes.STRING, defaultValue: "system" },
    };
    this.tableName = env.models.roles;
    this.options = {
      tableName: this.tableName,
      paranoid: true,
    };

    this.model = database.define("Role", this.attributes, this.options);
    // this.migrate(database);
    this.dtoFields = ["id", "name", "description"];
  }

  async migrate(database) {
    await database.sync({ force: false });
  }

  async getRoles() {
    const data = await this.model.findAll();
    return data;
  }

  async getRoleById(id) {
    const data = await this.model.findByPk(id, {
      include: { all: true, nested: true },
    });
    if (data) return data;
    else throw new Exception("NOT_FOUND", "Role not found");
  }

  async getRoleByName(name) {
    const data = await this.model.findOne({ where: { name } });
    if (data) return data;
    else throw new Exception("NOT_FOUND", "Role not found");
  }

  async createOne(roleData) {
    const role = this.model.build(roleData);
    await role.save();
    return role.toJSON();
  }

  async createRoot({ name, level, description }) {
    const role = await this.model.findOrCreate({
      where: { name, level, description },
    });
    return role;
  }

  async createMany(rolesData) {
    const data = this.model.bulkCreate(rolesData);
    if (data) return data;
    else throw new Exception("BAD_REQUEST", "Creation not possible");
  }

  async updateRole(id, roleData) {
    const result = await this.model.update(roleData, { where: { id } });
    if (result[0]) return result;
    else throw new Exception("NOT_MODIFIED", "Update not possible");
  }

  async deleteRole(id) {
    const result = await this.model.destroy({ where: { id } });
    if (result) return result;
    else throw new Exception("NOT_MODIFIED", "Delete not possible");
  }
};
