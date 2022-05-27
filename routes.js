const express = require("express");
const routes = express.Router();

const homeController = require("./src/controllers/homeController");
const registerController = require("./src/controllers/registerController");
const loginController = require("./src/controllers/loginController");
const contactController = require("./src/controllers/contactController");

const loginRequired = require("./src/middlewares/loginRequired");
const logoutRequired = require("./src/middlewares/logoutRequired");

routes.get("/", logoutRequired, homeController.index);

routes.get("/agenda", loginRequired, homeController.agenda);

routes.get("/register", logoutRequired, registerController.index);
routes.post("/register", logoutRequired, registerController.register);

routes.get("/login", logoutRequired, loginController.index);
routes.post("/login", logoutRequired, loginController.login);

routes.get("/addContact", loginRequired, contactController.index);
routes.post("/addContact", loginRequired, contactController.addContact);

routes.get("/logout", loginController.logout);

module.exports = routes;
