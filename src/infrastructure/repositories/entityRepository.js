const env = require("../config/environment");
const Exception = require("../../application/middlewares/exceptionMiddleware");

module.exports = class EntityRepository {
  constructor(database, DataTypes) {
    this.attributes = {
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
    };
    this.tableName = env.models.entities;
    this.options = {
      tableName: this.tableName,
      paranoid: true,
    };
    this.model = database.define("Entity", this.attributes, this.options);
    // this.migrate(database);
  }

  async migrate(database) {
    await database.sync({ force: false });
  }

  async getEntities() {
    const data = await this.model.findAll();
    return data;
  }

  async getEntityById(id) {
    const data = await this.model.findByPk(id);
    if (data) return data;
    else throw new Exception("NOT_FOUND", "Entity not found");
  }

  async getEntityByName(name) {
    const data = await this.model.findOrCreate({ where: { name } });
    if (data) return [data[0]];
    else throw new Exception("NOT_FOUND", "Entity not found");
  }

  async createOne(entityData) {
    const entity = this.model.build(entityData);
    await entity.save();
    return entity.toJSON();
  }

  async createMany(entitiesData) {
    const data = await this.model.bulkCreate(entitiesData);
    if (data) return data;
    else throw new Exception("BAD_REQUEST", "Creation not possible");
  }

  createDefaults(entities) {
    entities.map((name) => {
      this.model.findOrCreate({ where: { name } });
    });
  }

  async updateEntity(id, entityData) {
    const result = await this.model.update(entityData, { where: { id } });
    if (result[0]) return result;
    else throw new Exception("NOT_MODIFIED", "Update not possible");
  }

  async deleteEntity(id) {
    const result = await this.model.destroy({ where: { id } });
    if (result) return result;
    else throw new Exception("NOT_MODIFIED", "Delete not possible");
  }
};
