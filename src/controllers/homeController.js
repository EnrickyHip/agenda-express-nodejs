exports.index = (request, response) => {
  if (request.session.user) {
    return response.render("index");
  }

  return response.redirect("register");
};
