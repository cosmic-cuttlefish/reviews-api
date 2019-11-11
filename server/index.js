const express = require("express");
const bodyParser = require("body-parser");
const router = require("./router");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(router);
app.get("/", (req, res) => res.send("Hello World!"));

const handler = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

module.exports = { app, handler };
