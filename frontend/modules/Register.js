import { addValid, addInvalid } from "./validateInput";
import validator from "validator";
import axios from "axios";

export default class Register {
  constructor(form) {
    this.form = form;
    this.invalids = [];

    this.inputName = document.querySelector("#name");
    this.inputEmail = document.querySelector("#email");
    this.inputPassword = document.querySelector("#password");
    this.inputConfirmPassword = document.querySelector("#confirm-password");

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

    if (!this.inputName.value || !this.inputName.value.match(match)) {
      addInvalid(this.inputName);
      this.nameMessage.innerHTML = "Nome Inválido";
      this.invalids.push(this.inputName);
      return;
    }

    addValid(this.inputName);
    this.nameMessage.innerHTML = "";
  }

  async validateEmail() {
    if (!validator.isEmail(this.inputEmail.value)) {
      addInvalid(this.inputEmail);
      this.emailMessage.innerHTML = "E-mail Inválido";
      this.invalids.push(this.inputEmail);
      return;
    }

    try {
      const emailExists = await this.emailExists();

      if (emailExists) {
        addInvalid(this.inputEmail);
        this.emailMessage.innerHTML = "Usuário já existe";
        this.invalids.push(this.inputEmail);
        return;
      }
    } catch (error) {
      console.log(error);
    }

    addValid(this.inputEmail);
    this.emailMessage.innerHTML = "";
  }

  async emailExists() {
    const emailExists = await axios({
      method: "post",
      url: "/userExists",
      data: {
        email: this.inputEmail.value,
      },
    });

    return emailExists.data;
  }

  validatePassoword() {
    if (this.inputPassword.value.length < 3 || this.inputPassword.value.length > 50) {
      addInvalid(this.inputPassword);
      addInvalid(this.inputConfirmPassword);

      this.passwordMessage.innerHTML = "Sua senha precisa ter entre 3 e 50 caracteres";

      this.invalids.push(this.inputPassword);
      return;
    }

    addValid(this.inputPassword);
    this.passwordMessage.innerHTML = "";

    if (this.inputPassword.value !== this.inputConfirmPassword.value) {
      addInvalid(this.inputConfirmPassword);

      this.confirmPasswordMessage.innerHTML = "Senhas não coincidem";
      this.invalids.push(this.inputConfirmPassword);
      return;
    }

    addValid(this.inputConfirmPassword);
    this.confirmPasswordMessage.innerHTML = "";
  }
}
