const express = require("express");
const router = express.Router();
const middleware = require("../routes/middleware/jwt");

const User = require("../controllers/apis/user");
const Product = require("../controllers/apis/product");
const Order = require("../controllers/apis/order");

// <--- Routes --->

//User
router.get("/user/", User.getUser);

router.post("/user/create", User.createUser);
router.post("/user/login", User.login);

//Products
router.get("/product", middleware, Product.getProduct);
router.get("/product/all", middleware, Product.getProductAll);
router.post("/product/create", middleware, Product.createProduct);

//Order
router.get("/order", middleware, Order.getOrder);
router.get("/user/order/history", middleware, Order.getUserHistory);
router.post("/order/create", middleware, Order.createOrder);
router.put("/order/cancel", middleware, Order.cancelOrder);

module.exports = router;
