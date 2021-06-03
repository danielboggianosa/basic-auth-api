const express = require("express");
const PermissionUseCases = require("../../application/use_cases/permissionUseCases");
const { statusCode } = require("../../infrastructure/config/httpStatusCodes");

module.exports = (repositories) => {
  const permissionUseCases = new PermissionUseCases(repositories);
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const data = await permissionUseCases.getPermissions();
      res.status(statusCode.OK).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const data = await permissionUseCases.getPermissionById(req.params.id);
      res.status(statusCode.OK).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const data = await permissionUseCases.createOne(req.body);
      res.status(statusCode.CREATED).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.post("/bulk", async (req, res, next) => {
    try {
      const data = await permissionUseCases.createMany(req.body);
      res.status(statusCode.CREATED).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const result = await permissionUseCases.updatePermission(
        req.params.id,
        req.body
      );
      res.status(statusCode.CREATED).json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const result = await permissionUseCases.deletePermission(req.params.id);
      res.status(statusCode.OK).json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
