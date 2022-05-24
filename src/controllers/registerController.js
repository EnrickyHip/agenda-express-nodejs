const Register = require("../models/RegisterModel");

exports.index = (request, response) => {
  response.render("register");
};

// é essencial que essa função seja assíncrona, pois o registro do usuário depende da criação do registro no banco de dados, que é assíncrono. portanto, retorna uma promise
exports.register = async (request, response) => {
  try {
    const register = new Register(request.body);
    await register.register();

    if (register.errors.length) {
      request.flash("errors", register.errors);
      request.session.save(() => {
        response.redirect("back"); //caso haja erros no registro, o usuário é redirecionado de volta à página de registro.
      });
      return;
    }

    response.send("usuário registrado com sucesso!");
  } catch (error) {
    response.render("404");
  }
};
