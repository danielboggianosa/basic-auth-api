const express = require("express");
const EntityUseCases = require("../../application/use_cases/entityUseCases");
const { statusCode } = require("../../infrastructure/config/httpStatusCodes");

module.exports = (repositories) => {
  const entityUseCases = new EntityUseCases(repositories);
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const data = await entityUseCases.getEntities();
      res.status(statusCode.OK).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const data = await entityUseCases.getEntityById(req.params.id);
      res.status(statusCode.OK).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });
  router.get("/name/:name", async (req, res, next) => {
    try {
      const data = await entityUseCases.getEntityByName(req.params.name);
      res.status(statusCode.OK).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const data = await entityUseCases.createOne(req.body);
      res.status(statusCode.CREATED).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.post("/bulk", async (req, res, next) => {
    try {
      const data = await entityUseCases.createMany(req.body);
      res.status(statusCode.CREATED).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const result = await entityUseCases.updateEntity(req.params.id, req.body);
      res.status(statusCode.CREATED).json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const result = await entityUseCases.deleteEntity(req.params.id);
      res.status(statusCode.OK).json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
