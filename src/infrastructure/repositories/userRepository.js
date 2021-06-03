"use strict";

const env = require("../config/environment");
const Exception = require("../../application/middlewares/exceptionMiddleware");
const RoleRepository = require("./roleRepository");
const PermissionRepository = require("./permissionRepository");

module.exports = class UserRepository {
  constructor(database, DataTypes) {
    this.Role = new RoleRepository(database, DataTypes);
    this.Permission = new PermissionRepository(database, DataTypes);
    this.attributes = {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.STRING, defaultValue: "system" },
    };
    this.tableName = env.models.users;
    this.options = {
      tableName: this.tableName,
      paranoid: true,
    };

    this.model = database.define("User", this.attributes, this.options);
    // this.migrate(database);
    this.dtoFields = [
      "id",
      "firstName",
      "lastName",
      "email",
      "username",
      "image",
    ];
  }

  async migrate(database) {
    await database.sync({ force: false });
  }

  createDefaults() {
    const user = this.model.findOrCreate({
      where: {
        firstName: "Root",
        email: "root@localhost",
        username: "root",
        password: "root",
        createdBy: "system",
      },
    });
  }

  async getUsers() {
    const data = await this.model.findAll({ attributes: this.dtoFields });
    return data;
  }

  async getUserById(id) {
    const data = await this.model.findByPk(id, {
      attributes: this.dtoFields,
      include: { all: true, nested: true },
    });
    if (!data) throw new Exception("NOT_FOUND", "User not found");
    return data;
  }

  async getUserByEmail(email) {
    const data = await this.model.findOne({
      where: { email },
      attributes: this.dtoFields,
    });
    if (!data) throw new Exception("NOT_FOUND", "User not found");
    return data;
  }

  async getUserByUsername(username) {
    const data = await this.model.findOne({
      where: { username },
      include: {
        model: this.Role.model,
        as: "roles",
        attributes: ["id", "name", "description"],
      },
    });
    return data;
  }

  async registerOne(userData) {
    const newUser = this.model.build(userData);
    await newUser.save();
    const { id, firstName, lastName, email, username, image } =
      newUser.toJSON();
    return { id, firstName, lastName, email, username, image };
  }

  async registerMany(usersData) {
    const newUsers = await this.model.bulkCreate(usersData);
    const data = newUsers.map((user) => {
      const { id, firstName, lastName, email, username, image } = user;
      return { id, firstName, lastName, email, username, image };
    });
    return data;
  }

  async update(id, userData) {
    const result = await this.model.update(userData, { where: { id } });
    return result;
  }

  async delete(id) {
    const result = await this.model.destroy({ where: { id } });
    if (!result) throw new Exception("NOT_MODIFIED", "User not deleted");
    return result;
  }
};
