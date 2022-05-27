module.exports = (request, response, next) => {
  if (request.session.user) {
    request.session.save(() => response.redirect("/contacts"));
    return;
  }

  next();
};
