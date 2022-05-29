import { addValid, addInvalid, removeValidation } from "./validateInput";
import validator from "validator";
import { nameMatch } from "../../src/modules/constants";
import contactExists from "./contactExists";

export default class Contact {
  constructor(form) {
    this.form = form;
    this.invalids = [];

    this.nameInput = document.querySelector("#name");
    this.lastNameInput = document.querySelector("#last-name");
    this.emailInput = document.querySelector("#email");
    this.phoneInput = document.querySelector("#phone");

    this.nameMessage = document.querySelector("#name-message");
    this.lastNameMessage = document.querySelector("#last-name-message");
    this.emailMessage = document.querySelector("#email-message");
    this.phoneMessage = document.querySelector("#phone-message");

    this.inputId = document.querySelector("#input-id");
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

    !this.lastNameInput.value.length && removeValidation(this.lastNameInput);
    !this.emailInput.value.length && removeValidation(this.emailInput);
    !this.phoneInput.value.length && removeValidation(this.phoneInput);

    if (!this.emailInput.value && !this.phoneInput.value) {
      addInvalid(this.emailInput);
      addInvalid(this.phoneInput);

      this.emailMessage.innerHTML = "Pelo menos um contato precisa ser enviado: E-mail ou telefone";
      this.phoneMessage.innerHTML = "Pelo menos um contato precisa ser enviado: E-mail ou telefone";

      this.invalids.push(this.emailInput);
      this.invalids.push(this.phoneInput);
    }

    this.lastNameInput.value && this.validateLastName();
    this.emailInput.value && this.validateEmail();
    this.phoneInput.value && this.validatePhone();

    await this.checkContactExists();

    if (!this.invalids.length) return this.form.submit();
  }

  validateName() {
    if (!this.nameInput.value || !this.nameInput.value.match(nameMatch)) {
      addInvalid(this.nameInput);
      this.nameMessage.innerHTML = "Nome Inválido";
      this.invalids.push(this.nameInput);
      return;
    }

    addValid(this.nameInput);
    this.nameMessage.innerHTML = "";
  }

  validateLastName() {
    if (!this.lastNameInput.value.match(nameMatch)) {
      addInvalid(this.lastNameInput);
      this.lastNameMessage.innerHTML = "Sobrenome Inválido";
      this.invalids.push(this.lastNameInput);
      return;
    }

    addValid(this.lastNameInput);
    this.lastNameMessage.innerHTML = "";
  }

  validateEmail() {
    if (!validator.isEmail(this.emailInput.value)) {
      addInvalid(this.emailInput);
      this.emailMessage.innerHTML = "E-mail Inválido";
      this.invalids.push(this.emailInput);
    }
  }

  validatePhone() {
    const match = /[0-9]+/g;
    if (!this.phoneInput.value.match(match) || this.phoneInput.value.length < 9) {
      addInvalid(this.phoneInput);
      this.phoneMessage.innerHTML = "Telefone Inválido";
      this.invalids.push(this.phoneInput);
    }
  }

  async checkContactExists() {
    const [emailExists, phoneExists] = await contactExists(
      this.emailInput.value,
      this.phoneInput.value,
      this.inputId.value,
    );

    if (emailExists) {
      addInvalid(this.emailInput);
      this.emailMessage.innerHTML = "E-mail já existente";
      this.invalids.push(this.emailInput);
    } //eslint-disable-next-line
    else {
      if (this.emailInput.value && !this.invalids.includes(this.emailInput)) {
        addValid(this.emailInput);
        this.emailMessage.innerHTML = "";
      }
    }

    if (phoneExists) {
      addInvalid(this.phoneInput);
      this.phoneMessage.innerHTML = "Telefone já existente";
      this.invalids.push(this.phoneInput);
    } //eslint-disable-next-line
    else {
      if (this.phoneInput.value && !this.invalids.includes(this.phoneInput)) {
        addValid(this.phoneInput);
        this.phoneMessage.innerHTML = "";
      }
    }
  }
}
