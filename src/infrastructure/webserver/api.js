const express = require("express");
const userController = require("../../interfaces/controllers/userController");
const authController = require("../../interfaces/controllers/authController");
const roleController = require("../../interfaces/controllers/roleController");
const entityController = require("../../interfaces/controllers/entityController");
const permissionController = require("../../interfaces/controllers/permissionController");
const SecurityValidations = require('../../application/validations/securityValidations');

module.exports = ({repositories}) => {
  const api = express();
  const securityValidations = new SecurityValidations(repositories);

  api.use("/user", securityValidations.authentication, userController(repositories));
  api.use("/auth", authController(repositories));
  api.use("/role", securityValidations.authentication, roleController(repositories));
  api.use("/entity", securityValidations.authentication, entityController(repositories));
  api.use("/permission", securityValidations.authentication, permissionController(repositories));
  api.use((err, req, res, next) => {
    next(err)
  });

  return api;
};
