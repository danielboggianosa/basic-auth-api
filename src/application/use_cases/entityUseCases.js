"use strict";

module.exports = class EntityUseCases {
  constructor({ entityRepository }) {
    this.entityRepository = entityRepository;
  }

  async getEntities() {
    return await this.entityRepository.getEntities();
  }

  async getEntityById(id) {
    return await this.entityRepository.getEntityById(id);
  }

  async getEntityByName(name) {
    return await this.entityRepository.getEntityByName(name);
  }

  async createOne(entityData) {
    return await this.entityRepository.createOne(entityData);
  }

  async createMany(entitiesData) {
    return await this.entityRepository.createMany(entitiesData);
  }

  async updateEntity(id, entityData) {
    return await this.entityRepository.updateEntity(id, entityData);
  }

  async deleteEntity(id) {
    return await this.entityRepository.deleteEntity(id);
  }
};
