const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const stringfyObject = require("../modules/stringfyObject");
const { nameMatch } = require("./../modules/constants");

const RegisterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, require: true },
});

const RegisterModel = mongoose.model("Register", RegisterSchema);

class Register {
  constructor(postBody) {
    this.body = postBody; //postBody recebe o body da request, ou seja, os valores POST
    this.errors = [];
    this.user = null;
  }

  async register() {
    this.validate();
    if (this.errors.length) return; //se houver qualquer erro nos dados do formulário, o sistema não irá verificar se o usuário existe

    if (await this.userExists()) return this.errors.push("Usuário já existente");

    this.hashPassword();
    delete this.body.confirmPassword; //deleta a chave confirmPassword do body

    this.user = await RegisterModel.create(this.body); //registra o usuário no banco de dados. //*PRECISA SER ASSÍNCRONO.
  }

  async userExists() {
    return await RegisterModel.findOne({ email: this.body.email });
  }

  validate() {
    this.cleanUp();
    this.validateName();
    this.validateEmail();
    this.validatePassoword();
  }

  validateName() {
    if (!this.body.name || !this.body.name.match(nameMatch)) {
      return this.errors.push("Nome inválido");
    }
  }

  validateEmail() {
    if (!validator.isEmail(this.body.email)) {
      return this.errors.push("E-mail Inválido");
    }
  }

  validatePassoword() {
    if (this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push("Sua senha precisa ter entre 3 e 50 caracteres");
    }
    if (this.body.password !== this.body.confirmPassword) this.errors.push("Senhas não coincidem");
  }

  //método que limpa o objeto
  cleanUp() {
    this.body = stringfyObject(this.body);

    this.body = {
      name: this.body.name,
      email: this.body.email,
      password: this.body.password,
      confirmPassword: this.body["confirm-password"],
    };
  }

  //faz um hash da senha
  hashPassword() {
    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);
  }
}

module.exports = { Register, RegisterModel };
