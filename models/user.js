/*user model*/
var Sequelize = require("sequelize");
var sequelize = require("../configs/database");

var User = sequelize.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(50),
    },
    password: {
      type: Sequelize.STRING(64),
    },
    firstname: {
      type: Sequelize.STRING(30),
    },
    lastname: {
      type: Sequelize.STRING(30),
    },
    tel: {
      type: Sequelize.STRING(10),
    },
    status: {
      type: Sequelize.STRING(10),
    },
    created_id: {
      type: Sequelize.INTEGER,
    },
    updated_id: {
      type: Sequelize.INTEGER,
    },
  },
  {
    underscored: true,
    timestamps: true,
    createAt: true,
    paranoid: true,
  }
);
User.sync({
  alert: true,
});
module.exports = User;
