const User = require("../../models/user");
const SHA256 = require("crypto-js/sha256");
var jwt = require("jsonwebtoken");
const Joi = require("joi");

const rule = {
  register: {
    email: Joi.string()
      .max(100)
      .required(),
    password: Joi.string()
      .max(12)
      .required(),
    firstname: Joi.string()
      .max(30)
      .required(),
    lastname: Joi.string()
      .max(30)
      .required(),
  },
  login: {
    email: Joi.string()
      .max(50)
      .required(),
    password: Joi.string()
      .max(12)
      .required(),
  },
  getUser: {
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

exports.createUser = async (req, res, next) => {
  try {
    let validate = apiValidate(req, res, rule.register);
    if (validate) return res.status(422).json({ message: validate });

    let data = req.body;
    let password = SHA256(process.env.APP_KEY + data.password).toString();

    let user = await User.findOne({
      where: {
        email: data.email,
      },
    });

    if (user) {
      return res.status(200).json({
        status: false,
        message: "Email is already registered",
        status_code: "01",
      });
    }

    let userCreate = await User.create({
      email: data.email,
      password: password,
      firstname: data.firstname,
      lastname: data.lastname,
      status: "pending",
    });

    if (!userCreate) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong!",
        error: e,
      });
    }

    return res.status(201).json({
      status: true,
      message: "Create User Successfully",
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

exports.login = async (req, res, next) => {
  try {
    let validate = apiValidate(req, res, rule.login);
    if (validate) return res.status(422).json({ message: validate });
    let data = req.body;
    let password = SHA256(process.env.APP_KEY + data.password).toString();
    let user = await User.findOne({
      where: {
        email: data.email,
        password: password,
      },
      raw: true,
    });
    if (!user) {
      return res.status(200).json({
        status: false,
        message: "Authentication failed.",
        status_code: "01",
      });
    }
    let payload = {
      id: user.id,
      name: `${user.firstname}`,
      email: user.email,
    };
    let token = jwt.sign(payload, process.env.APP_KEY, { expiresIn: "1d" });
    return res.status(200).json({
      status: true,
      message: "Operation Successfully",
      status_code: "00",
      token: token,
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

exports.getUser = async (req, res, next) => {
  try {
    let validate = apiValidate(req, res, rule.getUser);
    if (validate) return res.status(422).json({ message: validate });
    let user = await User.findOne({
      where: {
        id: req.body.user_id,
      },
      raw: true,
      attributes: ["id", "email", "firstname", "lastname", "tel"],
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User is not found",
        status_code: "01",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Get User Successfully",
      data: user,
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
