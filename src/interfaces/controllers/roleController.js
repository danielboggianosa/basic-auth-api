const express = require("express");
const RoleUseCases = require("../../application/use_cases/roleUseCases");
const { statusCode } = require("../../infrastructure/config/httpStatusCodes");

module.exports = (repositories) => {
  const roleUseCases = new RoleUseCases(repositories);
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const data = await roleUseCases.getRoles();
      res.status(statusCode.OK).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const data = await roleUseCases.getRoleById(req.params.id);
      res.status(statusCode.OK).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });
  router.get("/name/:name", async (req, res, next) => {
    try {
      const data = await roleUseCases.getRoleByName(req.params.name);
      res.status(statusCode.OK).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const data = await roleUseCases.createOne(req.body);
      res.status(statusCode.CREATED).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.post("/bulk", async (req, res, next) => {
    try {
      const data = await roleUseCases.createMany(req.body);
      res.status(statusCode.CREATED).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const result = await roleUseCases.updateRole(req.params.id, req.body);
      res.status(statusCode.OK).json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const result = await roleUseCases.deleteRole(req.params.id);
      res.status(statusCode.OK).json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  router.post("/addPermission", async (req, res, next) => {
    try {
      const data = await roleUseCases.addPermission(req.body);
      res.status(statusCode.CREATED).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
