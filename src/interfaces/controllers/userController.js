"use strict";

const express = require("express");
const UserUseCases = require("../../application/use_cases/userUseCases");
const UserValidations = require("../../application/validations/userValidations");
const Exception = require("../../application/middlewares/exceptionMiddleware");
const { statusCode } = require("../../infrastructure/config/httpStatusCodes");
const SecurityValidations = require("../../application/validations/securityValidations");

module.exports = (repositories) => {
  const userValidations = new UserValidations();
  const securityValidations = new SecurityValidations(repositories)
  const router = express.Router();
  const userUseCases = new UserUseCases(repositories);
  const userTable = repositories.userRepository.tableName

  router.get("/", securityValidations.canReadAll(userTable), async (req, res, next) => {
    try {
      const data = await userUseCases.getUsers(req._user);
      res.status(statusCode.OK).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const data = await userUseCases.getUserById(req.params.id);
      res.status(statusCode.OK).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.get("/email/:email", async (req, res, next) => {
    try {
      const data = await userUseCases.getUserByEmail(req.params.email);
      res.status(statusCode.OK).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.post("/", userValidations.registerOne, async (req, res, next) => {
    try {
      const data = await userUseCases.registerOne(req.body);
      res.status(statusCode.CREATED).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.post("/bulk", userValidations.registerMany, async (req, res, next) => {
    try {
      const data = await userUseCases.registerMany(req.body);
      res.status(statusCode.CREATED).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const result = await userUseCases.update(req.params.id, req.body);
      if (result[0])
        res.status(statusCode.CREATED).json({ success: true, result });
      else throw new Exception("NOT_MODIFIED", "Update not possible");
    } catch (e) {
      next(e);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const result = await userUseCases.delete(req.params.id, req.body);
      res.status(statusCode.OK).json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

  router.post("/addRole", async (req, res, next) => {
    try {
      const data = await userUseCases.addRole(req.body);
      res.status(statusCode.CREATED).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
