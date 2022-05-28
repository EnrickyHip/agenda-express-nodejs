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

class Contact {
  constructor(postBody) {
    this.body = postBody;
    this.errors = [];
    this.contact = null;
  }

  static async getContactById(id) {
    if (typeof id !== "string") return;
    return await ContactModel.findById(id);
  }

  static async getAllContacts() {
    return await ContactModel.find().sort({ dateCreated: -1 });
  }

  static async delete(id) {
    if (typeof id !== "string") return;
    return await ContactModel.findOneAndDelete({ _id: id });
  }

  async register() {
    this.validate();
    if (this.errors.length) return;

    const [emailExists, phoneExists] = await this.contactExists();

    if (emailExists || phoneExists) return this.errors.push("contato já existe");

    this.contact = await ContactModel.create(this.body);
  }

  async edit(id) {
    if (typeof id !== "string") return;

    this.validate();
    if (this.errors.length) return;

    const [emailExists, phoneExists] = await this.contactExists(id);

    // caso exista um contato com o email/telefone enviado, emailContactId/phoneContactId irão receber o id do usuário refeirdo, caso contrário, irão receber o id do usuário que está sendo editado.
    const emailContactId = emailExists ? `${emailExists._id}` : id;
    const phoneContactId = phoneExists ? `${phoneExists._id}` : id;

    //se o id dos contatos não forem iguais ao do contato que está sendo editado, eles já estão em uso por outros usuários.
    if (emailContactId !== id || phoneContactId !== id) {
      return this.errors.push("E-mail ou Telefone já estão em uso");
    }

    this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true });
  }

  //esse método serve para saber se um contato já existe. Como tanto o telefone quanto o email podem ser usados, o método retorna um array com os usuários encontrados com o email e telefone enviados no formulário.
  async contactExists() {
    let email = null;
    let phone = null;

    if (this.body.email) {
      email = await ContactModel.findOne({ email: this.body.email });
    }

    if (this.body.phone) {
      phone = await ContactModel.findOne({ phone: this.body.phone });
    }

    return [email, phone];
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
    if (!this.body.phone.match(match) || this.body.phone.length < 9) {
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

module.exports = Contact;
