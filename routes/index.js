const express = require("express");
const Route = express.Router();
const user = require("./user");
const product = require("./product");
const address = require("./address");
const ordered = require("./ordered");

Route.use("/users", user);
Route.use("/product", product);
Route.use("/address", address);
Route.use("/order", ordered);

module.exports = Route;
