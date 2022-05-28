import "core-js/stable";
import "regenerator-runtime";

import "./assets/css/style.css";

import Register from "./modules/Register";

const registerForm = document.querySelector("#register-form");

if (registerForm) {
  const register = new Register(registerForm);
  register.addListener();
}
