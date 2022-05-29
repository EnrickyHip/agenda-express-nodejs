import "core-js/stable";
import "regenerator-runtime";

import "./assets/css/style.css";

import Register from "./modules/Register";
import Login from "./modules/Login";

const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");

if (registerForm) {
  const register = new Register(registerForm);
  register.addListener();
}

if (loginForm) {
  const login = new Login(loginForm);
  login.addListener();
}
