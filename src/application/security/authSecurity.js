"use strict";

const TokenSecurity = require("./tokenSecurity");
const PasswordSecurity = require("./passwordSecurity");
const Exception = require("../middlewares/exceptionMiddleware");

module.exports = class AuthSecurity {
  constructor(repositories) {
    this.userRepository = repositories.userRepository;
    this.roleRepository = repositories.roleRepository;
    this.userRolesRepository = repositories.userRolesRepository;
    this.rolePermisionsRepository = repositories.rolePermissionsRepository;
    this.permissionRepository = repositories.permissionRepository;
    this.entityRepository = repositories.entityRepository;
    this.repositories = repositories;
    this.tokenSecurity = new TokenSecurity();
    this.passwordSecurity = new PasswordSecurity();
  }

  async login({ username, password }) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) throw new Exception("NOT_FOUND", "User not found");
    const passwordMatches = await this.passwordMatches(password, user.password);
    if (passwordMatches) {
      const data = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.roles[0].id,
      };
      const token = await this.tokenSecurity.generate(data);
      return { ...data, token };
    } else throw new Exception("FORBIDEN", "Passwords do not match");
  }

  async register(user) {
    var data;
    const rootExists = await this.lookForRoot();
    if (rootExists) data = await this.createAppUser(user);
    else data = await this.createAppRoot(user);

    if (!data) throw new Exception("INTERNAL_SERVER_ERROR", "User not created");
    return data;
  }

  async sesion(token) {
    const isValid = await this.tokenSecurity.validate(token);
    if (isValid) return await this.tokenSecurity.payload(token);
    else throw new Exception("FORBIDEN", "Token is not valid");
  }

  async passwordMatches(password, hashed) {
    return await this.passwordSecurity.compare(password, hashed);
  }

  async logout() {
    return true;
  }

  async lookForRoot() {
    const result = await this.userRepository.getUsers();
    if (result.length === 0) return false;
    return true;
  }

  async createAppRoot(user) {
    const rootRole = await this.roleRepository.createRoot({
      name: "app_root",
      level: 0,
      description: "App Root User",
    });
    const entities = await this.createDefaultEntities();
    entities.map(async (entity) => {
      const permission = await this.permissionRepository.createRoot({
        read: true,
        readAll: true,
        create: true,
        update: true,
        updateAll: true,
        delete: true,
        deleteAll: true,
        entityId: entity.id,
      });
      await this.rolePermisionsRepository
        .addPermission(rootRole[0].id, permission[0].id)
        .catch((e) => {
          throw new Exception("INTERNAL_SERVER_ERROR", e);
        });
    });
    const data = await this.userRepository.registerOne(user);
    await this.userRolesRepository.addRole(data.id, rootRole[0].id);
    return data;
  }

  async createDefaultEntities() {
    const entities = Object.keys(this.repositories).map((key) => {
      return { name: this.repositories[key].tableName };
    });
    return await this.entityRepository.createMany(entities);
  }

  async createAppUser(user) {
    const userRole = await this.roleRepository.createOne({
      name: "app_user",
      level: 200,
      description: "App General User",
    });
    const entities = await this.entityRepository.getEntities();
    entities.map(async (entity) => {
      const permission = await this.permissionRepository.createRoot({
        read: true,
        readAll: false,
        create: true,
        update: true,
        updateAll: false,
        delete: true,
        deleteAll: false,
        entityId: entity.id,
      });
      await this.rolePermisionsRepository
        .addPermission(userRole.id, permission[0].id)
        .catch((e) => {
          throw new Exception("INTERNAL_SERVER_ERROR", e);
        });
    });
    const data = await this.userRepository.registerOne(user);
    await this.userRolesRepository.addRole(data.id, userRole.id);
    return data;
  }
};
