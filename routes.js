const express = require("express");
const routes = express.Router();
const homeController = require("./src/controllers/homeController");

routes.get("/", homeController.home);

module.exports = routes;
