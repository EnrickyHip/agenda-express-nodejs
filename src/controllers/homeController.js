exports.agenda = (request, response) => {
  return response.render("agenda"); //o método render carrega uma página ejs.
};

exports.index = (request, response) => {
  return response.render("index");
};
