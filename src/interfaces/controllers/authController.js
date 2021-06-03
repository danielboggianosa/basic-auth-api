const express = require("express");
const AuthSecurity = require("../../application/security/authSecurity");
const UserValidations = require("../../application/validations/userValidations");
const { statusCode } = require("../../infrastructure/config/httpStatusCodes");

module.exports = (repositories) => {
  const authSecurity = new AuthSecurity(repositories);
  const userValidations = new UserValidations();
  const router = express.Router();

  router.post("/login", async (req, res, next) => {
    try {
      const data = await authSecurity.login(req.body);
      res.status(statusCode.OK).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.post(
    "/register",
    userValidations.registerOne,
    async (req, res, next) => {
      try {
        const data = await authSecurity.register(req.body);
        res.status(statusCode.CREATED).json({ success: true, data });
      } catch (e) {
        next(e);
      }
    }
  );

  router.get("/sesion", async (req, res, next) => {
    const token = req.headers.authorization.split("Bearer ")[1];
    try {
      const data = await authSecurity.sesion(token);
      res.status(statusCode.OK).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  router.get("/logout", async (req, res, next) => {
    try {
      const success = await authSecurity.logout();
      res.status(statusCode.OK).json({ success, message: "Token destroyed" });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
