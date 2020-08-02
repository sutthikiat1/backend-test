/*user model*/
var Sequelize = require("sequelize");
var sequelize = require("../configs/database");

var Product = sequelize.define(
  "product",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    product_name: {
      type: Sequelize.STRING(50),
    },
    product_price: {
      type: Sequelize.FLOAT,
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
Product.sync({
  alert: true,
});
module.exports = Product;
