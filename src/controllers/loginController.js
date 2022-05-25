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
        response.redirect("back"); //caso haja erros no registro, o usuário é redirecionado de volta à página de registro.
      });
      return;
    }

    if (login.user) {
      request.session.save(() => {
        request.session.user = login.user;
        response.redirect("/");
      });
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
