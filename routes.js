const express = require("express");
const routes = express.Router();
const homeController = require("./src/controllers/homeController");
const registerController = require("./src/controllers/registerController");
const loginController = require("./src/controllers/loginController");

routes.get("/", homeController.index);

routes.get("/register", registerController.index);
routes.post("/register", registerController.register);

routes.get("/login", loginController.index);
routes.post("/login", loginController.login);

routes.get("/logout", loginController.logout);
module.exports = routes;
