"use strict";

module.exports = class RoleUseCases {
  constructor({ roleRepository, rolePermissionsRepository }) {
    this.roleRepository = roleRepository;
    this.rolePermissionsRepository = rolePermissionsRepository;
  }

  async getRoles() {
    return await this.roleRepository.getRoles();
  }

  async getRoleById(id) {
    return await this.roleRepository.getRoleById(id);
  }

  async getRoleByName(name) {
    return await this.roleRepository.getRoleByName(name);
  }

  async createOne(roleData) {
    return await this.roleRepository.createOne(roleData);
  }

  async createMany(roleData) {
    return await this.roleRepository.createMany(roleData);
  }

  async updateRole(id, roleData) {
    return await this.roleRepository.updateRole(id, roleData);
  }

  async deleteRole(id) {
    return await this.roleRepository.deleteRole(id);
  }

  async addPermission({ roleId, permissionId }) {
    return await this.rolePermissionsRepository.addPermission(
      roleId,
      permissionId
    );
  }
};
