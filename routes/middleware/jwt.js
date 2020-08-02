var jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    var token = req.headers["x-access-token"] || req.headers["token"];
    if (token) {
      jwt.verify(token, process.env.APP_KEY, function(err, decoded) {
        if (err) {
          return res
            .status(401)
            .json({ status: "error", message: "Unauthorized access." });
        }
        req.user = decoded;
        next();
      });
    } else {
      return res.status(403).send({
        status: "error",
        message: "No token provided.",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      status: "error",
      message: "No token provided.",
    });
  }
};
