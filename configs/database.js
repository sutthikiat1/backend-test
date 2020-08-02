/*Sequelize mysql*/
var Sequelize = require("sequelize");
var connection = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    timezone: "+07:00",
  }
);
module.exports = connection;
