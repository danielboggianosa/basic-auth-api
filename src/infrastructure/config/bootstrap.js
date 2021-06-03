"use strict";

const { database, DataTypes } = require("./mysqlDb");

const UserRepository = require("../repositories/userRepository");
const RoleRepository = require("../repositories/roleRepository");
const EntityRepository = require("../repositories/entityRepository");
const PermissionRepository = require("../repositories/permissionRepository");
const RolePermissionsRepository = require("../repositories/rolePermissionsRepository");
const UserRolesRepository = require("../repositories/userRolesRepository");

module.exports = () => {
  const userRepository = new UserRepository(database, DataTypes);
  const roleRepository = new RoleRepository(database, DataTypes);
  const entityRepository = new EntityRepository(database, DataTypes);
  const permissionRepository = new PermissionRepository(database, DataTypes);
  const rolePermissionsRepository = new RolePermissionsRepository(
    database,
    DataTypes
  );
  const userRolesRepository = new UserRolesRepository(database, DataTypes);

  const appContext = {
    repositories: {
      userRepository,
      roleRepository,
      entityRepository,
      permissionRepository,
      rolePermissionsRepository,
      userRolesRepository,
    },
  };

  userRepository.model.belongsToMany(roleRepository.model, {
    through: "user_roles",
    as: "roles",
  });
  roleRepository.model.belongsToMany(permissionRepository.model, {
    through: "role_permissions",
    as: "permissions",
  });
  permissionRepository.model.belongsTo(entityRepository.model, {
    as: "entity",
  });

  database.sync({ force: false });

  /*  const Entities = Object.keys(appContext.repositories).map((key) =>
    appContext.repositories[key].tableName()
  );
  entityRepository.createDefaults(Entities);
  permissionRepository.createDefaults();
  rolesEntitiesPermissionsRepository.createDefaults(Entities);
  roleRepository.createDefaults();
  userRepository.createDefaults();
  userRolesRepository.createDefaults(); */

  return appContext;
};
