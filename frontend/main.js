import "core-js/stable";
import "regenerator-runtime";

import "./assets/css/style.css";

import Register from "./modules/Register";
import Login from "./modules/Login";
import Contact from "./modules/Contact";

const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");
const contactForm = document.querySelector(".contact-form");

if (registerForm) {
  const register = new Register(registerForm);
  register.addListener();
}

if (contactForm) {
  const register = new Contact(contactForm);
  register.addListener();
}

if (loginForm) {
  const login = new Login(loginForm);
  login.addListener();
}
