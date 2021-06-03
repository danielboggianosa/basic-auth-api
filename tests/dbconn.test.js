const { database } = require("../src/infrastructure/config/mysqlDb");

module.exports = testDbConnection = async () => {
  try {
    await database.authenticate();
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return false;
  }
};
