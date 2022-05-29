const express = require("express");
const routes = express.Router();

const homeController = require("./src/controllers/homeController");
const registerController = require("./src/controllers/registerController");
const loginController = require("./src/controllers/loginController");
const contactsController = require("./src/controllers/contactsController");

const loginRequired = require("./src/middlewares/loginRequired");
const logoutRequired = require("./src/middlewares/logoutRequired");

routes.get("/", logoutRequired, homeController.index);

routes.get("/contacts", loginRequired, contactsController.index);
routes.get("/contacts/add", loginRequired, contactsController.add);
routes.post("/contacts/add", loginRequired, contactsController.addContact);
routes.get("/contacts/edit/:id?", loginRequired, contactsController.edit);
routes.post("/contacts/edit/:id", loginRequired, contactsController.editContact);
routes.get("/contacts/delete/:id", loginRequired, contactsController.delete);

routes.post("/userExists", logoutRequired, registerController.userExists);
routes.post("/passwordMatches", logoutRequired, loginController.passwordMatches);

routes.get("/register", logoutRequired, registerController.index);
routes.post("/register", logoutRequired, registerController.register);

routes.get("/login", logoutRequired, loginController.index);
routes.post("/login", logoutRequired, loginController.login);

routes.get("/logout", loginController.logout);

module.exports = routes;
