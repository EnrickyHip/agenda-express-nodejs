const Login = require("./../models/LoginModel");

exports.index = (request, response) => {
  response.render("login", { values: {} });
};

exports.login = async (request, response) => {
  try {
    const login = new Login(request.body);
    await login.login();

    if (login.errors.length) {
      request.flash("errors", login.errors);
      response.locals.errors = request.flash("errors");
      request.session.save(() => response.render("login", { values: request.body })); //caso haja erros no login, o usuário é redirecionado de volta à página de login. o save() salva os erros no banco de dados para que fiquem salvos e apareçam na tela.
      return;
    }

    if (login.user) {
      request.session.user = login.user;
      request.session.save(() => response.redirect("/contacts"));
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

exports.passwordMatches = async (request, response) => {
  const login = new Login(request.body);
  await login.getUser();
  const passwordMatches = await login.passwordsMatch();

  response.send(passwordMatches);
};
