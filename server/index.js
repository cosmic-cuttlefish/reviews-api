const express = require("express");
const bodyParser = require("body-parser");
const router = require("./router");
require("dotenv").config();
const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());
app.use(router);

module.exports = app;
