const Order = require("../../models/order");
const Product = require("../../models/product");
const models = require("../../models");
const Joi = require("joi");
const moment = require("moment");

const rule = {
  createOrder: {
    product_id: Joi.number().required(),
    unit: Joi.number().required(),
  },
  getOrder: {
    order_id: Joi.number().required(),
  },
  cancelOrder: {
    order_id: Joi.number().required(),
  },
  getUserHistory: {
    user_id: Joi.number().required(),
  },
};

const apiValidate = (req, res, rule) => {
  let err = Joi.validate(req.body, rule, { abortEarly: false });
  if (err && err.error !== null) {
    message = [];
    unique = [];
    err.error.details.forEach((element) => {
      if (!(element.path in unique)) {
        message.push(element.message);
      }
    });
    return message;
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    let validate = apiValidate(req, res, rule.createOrder);
    if (validate) return res.status(422).json({ message: validate });

    let { unit, product_id } = req.body;

    let product = await Product.findOne({
      where: {
        id: product_id,
      },
      raw: true,
    });

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product is not found",
        status_code: "01",
      });
    }

    let order = await Order.create({
      product_id: product_id,
      user_id: req.user.id,
      unit: unit,
      status: "active",
      created_user_id: req.user.id,
    });

    if (!order) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong!",
        error: e,
      });
    }

    return res.status(201).json({
      status: true,
      message: "Create Order Successfully",
      data: order,
      status_code: "00",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: false,
      message: "Something went wrong!",
      error: e,
    });
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    let validate = apiValidate(req, res, rule.cancelOrder);
    if (validate) return res.status(422).json({ message: validate });

    let { order_id } = req.body;
    let order = await Order.findOne({
      where: {
        id: order_id,
      },
      raw: true,
    });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order is not found",
        status_code: "01",
      });
    }

    let updateOrder = await Order.update(
      {
        status: "Cancel",
        updated_user_id: req.user.id,
      },
      {
        where: {
          id: order.id,
        },
      }
    );

    if (!updateOrder) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong!",
        error: e,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Cancel Order Successfully",
      status_code: "00",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: false,
      message: "Something went wrong!",
      error: e,
    });
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    let validate = apiValidate(req, res, rule.getOrder);
    if (validate) return res.status(422).json({ message: validate });

    let { order_id } = req.body;
    let order = await Order.findOne({
      where: {
        id: order_id,
      },
      include: [
        {
          model: models.User,
          attributes: ["firstname", "lastname"],
        },
        {
          model: models.Product,
          attributes: ["product_name", "product_price"],
        },
      ],
      raw: true,
      attributes: ["id", "unit"],
    });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order is not found",
        status_code: "01",
      });
    }

    let sum_order = order.unit * order["product.product_price"];
    order.price_total = sum_order;

    return res.status(200).json({
      status: true,
      message: "Get Order Successfully",
      data: order,
      status_code: "00",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: false,
      message: "Something went wrong!",
      error: e,
    });
  }
};

exports.getUserHistory = async (req, res, next) => {
  try {
    let validate = apiValidate(req, res, rule.getUserHistory);
    if (validate) return res.status(422).json({ message: validate });

    let { user_id } = req.body;
    let orders = await Order.findAll({
      where: {
        user_id: user_id,
        status: "Active",
      },
      include: [
        {
          model: models.User,
          attributes: ["firstname", "lastname"],
        },
        {
          model: models.Product,
          attributes: ["product_name", "product_price"],
        },
      ],
      raw: true,
      order: [["id", "DESC"]],
    });

    let response = {};
    if (orders.length > 0) {
      let data = orders.map((order) => {
        let total_price = order.unit * order["product.product_price"];
        let obj = {
          id: order.id,
          product_name: order["product.product_name"],
          product_price: order["product.product_price"],
          unit: order.unit,
          total_price: total_price,
          status: order.status,
          create_at: moment(order.createdAt).format("DD-MM-YYYY HH:mm"),
        };
        return obj;
      });

      response = {
        firstname: orders[0]["user.firstname"],
        lastname: orders[0]["user.lastname"],
        order_list: data,
      };
    }

    return res.status(200).json({
      status: true,
      message: "Get User Successfully",
      data: response,
      status_code: "00",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: false,
      message: "Something went wrong!",
      error: e,
    });
  }
};
