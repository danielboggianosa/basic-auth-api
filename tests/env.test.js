const env = require("../src/infrastructure/config/environment");

module.exports = testEnvironment = () => {
  let pass = true;
  Object.keys(env.db).map((k) => {
    if (!env.db[k]) {
      pass = false;
      console.log(k + " in env.db is not defined");
    }
  });
  Object.keys(env.models).map((k) => {
    if (!env.models[k]) {
      pass = false;
      console.log(k + " in env.models is not defined");
    }
  });
  Object.keys(env.app).map((k) => {
    if (!env.app[k]) {
      pass = false;
      console.log(k + " in env.app is not defined");
    }
  });
  Object.keys(env.jwt).map((k) => {
    if (!env.jwt[k]) {
      pass = false;
      console.log(k + " in env.jwt is not defined");
    }
  });
  return pass;
};