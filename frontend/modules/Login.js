import { addValid, addInvalid, removeValidation } from "./validateInput";
import userExists from "./userExists";
import passwordMatches from "./passwordMatches";

export default class Login {
  constructor(form) {
    this.form = form;
    this.invalids = [];

    this.emailInput = document.querySelector("#email");
    this.passwordInput = document.querySelector("#password");

    this.emailMessage = document.querySelector("#login-email-message");
    this.passwordMessage = document.querySelector("#login-password-message");
  }

  addListener() {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.validate();
    });
  }

  async validate() {
    this.invalids = [];
    await this.checkUserExists();

    if (this.invalids.length) return;
    await this.validatePassword();

    if (!this.invalids.length) return this.form.submit();
  }

  async checkUserExists() {
    const existsUser = await userExists(this.emailInput.value);

    if (!existsUser) {
      addInvalid(this.emailInput);
      this.emailMessage.innerHTML = "Usuário não existe";
      this.invalids.push(this.emailInput);
      removeValidation(this.passwordInput);
      return;
    }

    addValid(this.emailInput);
    this.emailMessage.innerHTML = "";
  }

  async validatePassword() {
    const matches = await passwordMatches(this.emailInput.value, this.passwordInput.value);
    if (!matches) {
      addInvalid(this.passwordInput);
      this.passwordMessage.innerHTML = "Senha incorreta";
      this.invalids.push(this.passwordInput);
      return;
    }

    addValid(this.passwordInput);
    this.passwordMessage.innerHTML = "";
  }
}
