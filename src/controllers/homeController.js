exports.agenda = (request, response) => {
  if (request.session.user) {
    return response.render("agenda"); //o método render carrega uma página ejs.
  }

  return response.redirect("/"); //redirect redireciona para alguma rota.
};

exports.index = (request, response) => {
  if (request.session.user) {
    return response.redirect("/agenda");
  }

  return response.render("index");
};
