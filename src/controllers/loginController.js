const Login = require("./../models/LoginModel");

exports.index = (request, response) => {
  if (request.session.user) {
    return response.redirect("/");
  }

  response.render("login");
};

exports.login = async (request, response) => {
  try {
    const login = new Login(request.body);
    await login.login();

    if (login.errors.length) {
      request.flash("errors", login.errors);
      request.session.save(() => {
        //salva os erros no banco de dados para que fiquem salvos e apareçam na tela.
        response.redirect("back"); //caso haja erros no login, o usuário é redirecionado de volta à página de login.
      });
      return;
    }

    if (login.user) {
      request.session.user = login.user;
      request.session.save(() => {
        response.redirect("/agenda");
      });
      return;
    }
  } catch (error) {
    console.log(error);
    response.render("404");
  }
};

exports.logout = (request, response) => {
  request.session.destroy();
  response.redirect("/");
};
