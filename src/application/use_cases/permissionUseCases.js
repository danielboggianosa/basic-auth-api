"use strict";

module.exports = class PermissionUseCases {
  constructor({ permissionRepository }) {
    this.permissionRepository = permissionRepository;
  }

  async getPermissions() {
    return await this.permissionRepository.getPermissions();
  }

  async getPermissionById(id) {
    return await this.permissionRepository.getPermissionById(id);
  }

  async createOne(permissionData) {
    return await this.permissionRepository.createOne(permissionData);
  }

  async createMany(permissionsData) {
    return await this.permissionRepository.createMany(permissionsData);
  }

  async updatePermission(id, permissionData) {
    return await this.permissionRepository.updatePermission(id, permissionData);
  }

  async deletePermission(id) {
    return await this.permissionRepository.deletePermission(id);
  }
};
