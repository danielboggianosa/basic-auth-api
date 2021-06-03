const env = require("../config/environment");
const Exception = require("../../application/middlewares/exceptionMiddleware");

module.exports = class PermissionRepository {
  constructor(database, DataTypes) {
    this.attributes = {
      read: { type: DataTypes.BOOLEAN, defaultValue: false },
      readAll: { type: DataTypes.BOOLEAN, defaultValue: false },
      create: { type: DataTypes.BOOLEAN, defaultValue: false },
      update: { type: DataTypes.BOOLEAN, defaultValue: false },
      updateAll: { type: DataTypes.BOOLEAN, defaultValue: false },
      delete: { type: DataTypes.BOOLEAN, defaultValue: false },
      deleteAll: { type: DataTypes.BOOLEAN, defaultValue: false },
      createdBy: { type: DataTypes.STRING, defaultValue: "system" },
      entityId: {type: DataTypes.INTEGER}
    };
    this.tableName = env.models.permissions;
    this.options = {
      tableName: this.tableName,
      paranoid: true,
    };
    this.model = database.define("Permission", this.attributes, this.options);
  }

  async getPermissions() {
    const data = await this.model.findAll();
    return data;
  }

  async getPermissionById(id) {
    const data = await this.model.findByPk(id, { include: "entity" });
    if (data) return data;
    else throw new Exception("NOT_FOUND", "Permission not found");
  }

  async createOne(permissionData) {
    const permission = this.model.build(permissionData);
    await permission.save();
    return permission.toJSON();
  }

  async createRoot({
    read,
    readAll,
    create,
    update,
    updateAll,
    delete: dell,
    deleteAll,
    entityId,
  }) {
    const permission = await this.model.findOrCreate({where: {
      read,
      readAll,
      create,
      update,
      updateAll,
      delete: dell,
      deleteAll,
      entityId,
    }});
    return permission;
  }

  async createMany(permissionsData) {
    const data = await this.model.bulkCreate(permissionsData);
    if (data) return data;
    else throw new Exception("BAD_REQUEST", "Creation not possible");
  }

  async updatePermission(id, permissionData) {
    const result = await this.model.update(permissionData, { where: { id } });
    if (result[0]) return result;
    else throw new Exception("NOT_MODIFIED", "Update not possible");
  }

  async deletePermission(id) {
    const result = await this.model.destroy({ where: { id } });
    if (result) return result;
    else throw new Exception("NOT_MODIFIED", "Delete not possible");
  }
};
