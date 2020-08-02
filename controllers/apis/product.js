const Product = require("../../models/product");
const SHA256 = require("crypto-js/sha256");
var jwt = require("jsonwebtoken");
const Joi = require("joi");

const rule = {
  createProduct: {
    product_name: Joi.string().required(),
    product_price: Joi.number().required(),
  },
  getProduct: {
    product_id: Joi.number().required(),
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

exports.getProduct = async (req, res, next) => {
  try {
    let validate = apiValidate(req, res, rule.getProduct);
    if (validate) return res.status(422).json({ message: validate });
    let product = await Product.findOne({
      where: {
        id: req.body.product_id,
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

    return res.status(200).json({
      status: true,
      message: "Get Product Successfully",
      data: product,
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

exports.getProductAll = async (req, res, next) => {
  try {
    let product = await Product.findAll({
      raw: true,
    });

    return res.status(200).json({
      status: true,
      message: "Get Product Successfully",
      data: product,
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

exports.createProduct = async (req, res, next) => {
  try {
    let validate = apiValidate(req, res, rule.createProduct);
    if (validate) return res.status(422).json({ message: validate });

    let { product_name, product_price } = req.body;
    let product = await Product.create({
      product_name: product_name,
      product_price: product_price,
      status: "active",
      created_user_id: req.user.id,
    });

    if (!product) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong!",
        error: e,
      });
    }

    return res.status(201).json({
      status: true,
      message: "Add Product Successfully",
      data: product,
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
