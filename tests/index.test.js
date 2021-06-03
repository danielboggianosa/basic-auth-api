const testDbConnection = require("./dbconn.test");
const testEnvironment = require("./env.test");

const test = (descripton, unit) => {
  console.log("\n" + descripton);
  if (unit) console.log("\x1b[42m%s\x1b[0m", " PASS ");
  else console.log("\x1b[41m%s\x1b[0m", " FAIL ");
};

const pass = () =>{
    console.log
}

(() => {
  const start = new Date();
  test("Environment variables configuration", testEnvironment());
  test("Database connection", testDbConnection());
  console.log("\nElapsed Time: " + (new Date() - start ) + " ms");
  return;
})();
