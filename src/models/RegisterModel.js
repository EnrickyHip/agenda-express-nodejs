const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const RegisterSchema = new mongoose.Schema({
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

    await this.checkUser(); // checa se o usuário já existe
    if (this.errors.length) return;

    this.hashPassword();
    delete this.body.confirmPassword; //deleta a chave confirmPassword do body
    try {
      this.user = await RegisterModel.create(this.body); //registra o usuário no banco de dados. //*PRECISA SER ASSÍNCRONO.
    } catch (error) {
      this.errors.push("houve um erro na conexão com o banco de dados.");
    }
  }

  validate() {
    this.cleanUp();
    this.validateEmail();
    this.validatePassoword();
  }

  validateEmail() {
    if (!validator.isEmail(this.body.email)) this.errors.push("E-mail Inválido");
  }

  validatePassoword() {
    if (this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push("Sua senha precisa ter entre 3 e 50 caracteres");
    }
    if (this.body.password !== this.body.confirmPassword) this.errors.push("Senhas não coincidem");
  }

  async checkUser() {
    const user = await RegisterModel.findOne({ email: this.body.email });
    if (user) this.errors.push("Usuário já existente");
  }

  //método que limpa o objeto
  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    this.body = {
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

module.exports = Register;
