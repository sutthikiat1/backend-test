var User = require("./user");
var Product = require("./product");
var Order = require("./order");

Order.belongsTo(User, { foreignKey: "user_id" });
Order.belongsTo(Product, { foreignKey: "product_id" });

module.exports = {
  User,
  Product,
  Order,
};
