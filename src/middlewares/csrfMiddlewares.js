exports.checkCsrfError = (error, request, response) => {
  if (error && error.code === "EBADCSRFTOKEN") {
    return response.render("CSRFError");
  }
};

exports.csrfMiddleware = (request, response, next) => {
  console.log("entrou aqui");
  response.locals.csrfToken = request.csrfToken();
  next();
};
