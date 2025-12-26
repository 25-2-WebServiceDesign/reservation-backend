const { Sequelize } = require("sequelize");
require("dotenv").config();

const isTest = process.env.NODE_ENV === "test";

let sequelize;

if (isTest) {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    define: { underscored: true },
  });
} else {
  const DB_HOST = process.env.DB_HOST;
  const DB_PORT = process.env.DB_PORT;
  const DB_USERNAME = process.env.DB_USERNAME;
  const DB_PASSWORD = process.env.DB_PASSWORD;
  const DB_NAME = process.env.DB_NAME;

  sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: false,
    define: { underscored: true },
  });
}

module.exports = sequelize;

// test connection

// (async () => {
//     try {
//         await sequelize.authenticate();
//         console.log("Connected!");
//     } catch(err) {
//         console.log(err);
//     }
// })()