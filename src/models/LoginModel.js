const bcryptjs = require("bcryptjs");
const validator = require("validator");
const stringfyObject = require("../modules/stringfyObject");
const { RegisterModel } = require("./RegisterModel");

class LoginModel {
  constructor(postBody) {
    this.body = postBody;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.cleanUp();
    this.validateEmail();

    if (this.errors.length) return;

    this.user = await RegisterModel.findOne({ email: this.body.email });
    if (!this.user) return this.errors.push("Usuário não existe"); // checa se o usuário já existe

    if (!this.passwordsMatch()) {
      this.user = null;
      return this.errors.push("senha incorreta");
    }
  }

  passwordsMatch() {
    return bcryptjs.compareSync(this.body.password, this.user.password);
  }

  validateEmail() {
    if (!validator.isEmail(this.body.email)) {
      return this.errors.push("E-mail Inválido");
    }
  }

  cleanUp() {
    this.body = stringfyObject(this.body);

    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = LoginModel;
