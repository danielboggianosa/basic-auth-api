"use strict";
const express = require("express");
const {
  statusCode,
  statusResponse,
} = require("./infrastructure/config/httpStatusCodes");
const api = require("./infrastructure/webserver/api");
const bootstrap = require("./infrastructure/config/bootstrap");
const appContext = bootstrap();

const app = express();

app.use(express.json());
app.use("/api", api(appContext));

app.use((req, res, next) => {
  return res
    .status(statusCode.NOT_FOUND)
    .json({ error: statusResponse.NOT_FOUND });
});

app.use((err, req, res, _next) => {
  if (typeof err.name != "number")
    res
      .status(500)
      .json({
        success: false,
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
  else
    res.status(err.name).json({
      success: false,
      message: err.message,
    });
});

module.exports = app;
