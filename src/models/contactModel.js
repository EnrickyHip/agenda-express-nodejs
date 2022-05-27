const mongoose = require("mongoose");
const validator = require("validator");
const stringfyObject = require("../modules/stringfyObject");

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  phone: { type: String, required: false, default: "" },
  dateCreated: { type: Date, default: Date.now() },
});

const ContactModel = mongoose.model("Contact", ContactSchema);

class ContactRegister {
  constructor(postBody) {
    this.body = postBody;
    this.errors = [];
    this.contact = null;
  }

  async register() {
    this.validate();
    if (this.errors.length) return;

    if (await this.contactExists()) return this.errors.push("contato já existe");

    this.contact = await ContactModel.create(this.body);
  }

  async contactExists() {
    let email = null;
    let phone = null;

    if (this.body.email) {
      email = await ContactModel.findOne({ email: this.body.email });
    }

    if (this.body.phone) {
      phone = await ContactModel.findOne({ phone: this.body.phone });
    }

    return phone || email;
  }

  validate() {
    this.cleanUp();
    this.validateName();

    if (!this.body.phone && !this.body.email) {
      return this.errors.push("Pelo menos um contato precisa ser enviado: E-mail ou telefone");
    }

    this.body.lastName && this.validateLastName();
    this.body.email && this.validateEmail();
    this.body.phone && this.validatePhone();
  }

  validatePhone() {
    const match = /[0-9]+/g;
    if (!this.body.phone.match(match)) {
      return this.errors.push("Telefone Inválido");
    }
  }

  validateEmail() {
    if (!validator.isEmail(this.body.email)) {
      return this.errors.push("E-mail Inválido");
    }
  }

  validateName() {
    const match = /^[a-zA-Z0-9_, áàâãéèêíïóôõöúçñ]*$/;
    if (!this.body.name || !this.body.name.match(match)) {
      return this.errors.push("Nome inválido");
    }
  }

  validateLastName() {
    const match = /^[a-zA-Z0-9_, áàâãéèêíïóôõöúçñ]*$/;
    if (!this.body.lastName.match(match)) {
      return this.errors.push("Sobrenome inválido");
    }
  }

  cleanUp() {
    this.body = stringfyObject(this.body);

    this.body = {
      name: this.body.name,
      lastName: this.body["last-name"],
      email: this.body.email,
      phone: this.body.phone,
    };
  }
}

module.exports = ContactRegister;
