const express = require("express");
const routes = express.Router();
const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");
const registerController = require("./src/controllers/registerController");

routes.get("/", homeController.index);
routes.get("/login", loginController.index);
routes.get("/register", registerController.index);
routes.post("/register", registerController.register);

module.exports = routes;
