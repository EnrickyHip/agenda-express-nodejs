exports.globalErrors = (request, response, next) => {
  response.locals.errors = request.flash("errors"); //pega as mensagens de erro guardados no flash "errors" e joga numa variável local que pode ser usada no ejs.
  next();
};
