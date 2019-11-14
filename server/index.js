const express = require("express");
const bodyParser = require("body-parser");
const router = require("./router");
require("dotenv").config();
const app = express();

app.use(bodyParser.json());
app.use(router);
app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
