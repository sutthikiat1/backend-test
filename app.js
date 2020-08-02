const compression = require("compression");
const express = require("express");
require("dotenv").config();
const app = express();
const port = 3000 || process.env.APP_PORT + 1;
const bodyParser = require("body-parser");
const web = require("./routes/web");
var models = require("./models");

app.use(compression());

app.use(async function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, token"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use("/api", web);
app.use(function(req, res, next) {
  return res.status(404).json({
    status: false,
    message: "Routes not found",
  });
});

//Port
app.listen(port, () => {
  console.log("Connect Successfully. Port : " + port);
});
exports = module.exports = app;
