"use strict";

const PasswordSecurity = require("../security/passwordSecurity");

module.exports = class UserUseCases {
  constructor({ userRepository, userRolesRepository }) {
    this.userRepository = userRepository;
    this.userRolesRepository = userRolesRepository;
    this.passwordSecurity = new PasswordSecurity();
  }

  async getUsers() {
    const data = await this.userRepository.getUsers();
    return data;
  }

  async getUserById(id) {
    const data = await this.userRepository.getUserById(id);
    return data;
  }

  async getUserByEmail(email) {
    const data = await this.userRepository.getUserByEmail(email);
    return data;
  }

  async registerOne(userData) {
    return await this.userRepository.registerOne(userData);
  }

  async registerMany(usersData) {
    return await this.userRepository.registerMany(usersData);
  }

  async update(id, userData) {
    return await this.userRepository.update(id, userData);
  }

  async delete(id) {
    return await this.userRepository.delete(id);
  }

  async addRole({userId, roleId}) {
    return await this.userRolesRepository.addRole(userId, roleId);
  }
};
