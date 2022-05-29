import { addValid, addInvalid } from "./validateInput";
import validator from "validator";
import userExists from "./userExists";

export default class Register {
  constructor(form) {
    this.form = form;
    this.invalids = [];

    this.nameInput = document.querySelector("#name");
    this.emailInput = document.querySelector("#email");
    this.passwordInput = document.querySelector("#password");
    this.confirmPasswordInout = document.querySelector("#confirm-password");

    this.nameMessage = document.querySelector("#register-name-message");
    this.emailMessage = document.querySelector("#register-email-message");
    this.passwordMessage = document.querySelector("#register-password-message");
    this.confirmPasswordMessage = document.querySelector("#register-confirm-password-message");
  }

  addListener() {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.validate();
    });
  }

  async validate() {
    this.invalids = [];
    this.validateName();
    await this.validateEmail();
    this.validatePassoword();

    if (!this.invalids.length) this.form.submit();
  }

  validateName() {
    const match = /^[a-zA-Z0-9_, áàâãéèêíïóôõöúçñ]*$/;

    if (!this.nameInput.value || !this.nameInput.value.match(match)) {
      addInvalid(this.nameInput);
      this.nameMessage.innerHTML = "Nome Inválido";
      this.invalids.push(this.nameInput);
      return;
    }

    addValid(this.nameInput);
    this.nameMessage.innerHTML = "";
  }

  async validateEmail() {
    if (!validator.isEmail(this.emailInput.value)) {
      addInvalid(this.emailInput);
      this.emailMessage.innerHTML = "E-mail Inválido";
      this.invalids.push(this.emailInput);
      return;
    }

    try {
      const _userExists = await userExists(this.emailInput.value);

      if (_userExists) {
        addInvalid(this.emailInput);
        this.emailMessage.innerHTML = "Usuário já existe";
        this.invalids.push(this.emailInput);
        return;
      }
    } catch (error) {
      console.log(error);
    }

    addValid(this.emailInput);
    this.emailMessage.innerHTML = "";
  }

  validatePassoword() {
    if (this.passwordInput.value.length < 3 || this.passwordInput.value.length > 50) {
      addInvalid(this.passwordInput);
      addInvalid(this.confirmPasswordInout);

      this.passwordMessage.innerHTML = "Sua senha precisa ter entre 3 e 50 caracteres";

      this.invalids.push(this.passwordInput);
      return;
    }

    addValid(this.passwordInput);
    this.passwordMessage.innerHTML = "";

    if (this.passwordInput.value !== this.confirmPasswordInout.value) {
      addInvalid(this.confirmPasswordInout);

      this.confirmPasswordMessage.innerHTML = "Senhas não coincidem";
      this.invalids.push(this.confirmPasswordInout);
      return;
    }

    addValid(this.confirmPasswordInout);
    this.confirmPasswordMessage.innerHTML = "";
  }
}
