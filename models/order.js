/*user model*/
var Sequelize = require("sequelize");
var sequelize = require("../configs/database");

var Order = sequelize.define(
  "order",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    product_id: {
      type: Sequelize.INTEGER(10),
    },
    user_id: {
      type: Sequelize.INTEGER(10),
    },
    unit: {
      type: Sequelize.INTEGER(10),
    },
    status: {
      type: Sequelize.STRING(10),
    },
    created_user_id: {
      type: Sequelize.INTEGER,
    },
    updated_user_id: {
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
Order.sync({
  alert: true,
});
module.exports = Order;
