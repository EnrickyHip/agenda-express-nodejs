const ContactRegister = require("../models/contactModel");

exports.index = (request, response) => {
  response.render("addContact");
};

exports.addContact = async (request, response) => {
  try {
    const contact = new ContactRegister(request.body);
    await contact.register();

    if (contact.errors.length) {
      request.flash("errors", contact.errors);
      request.session.save(() => response.redirect("back"));
      return;
    }

    if (contact.contact) {
      request.flash("success", "Contato criado com sucesso");
      request.session.save(() => response.redirect("/agenda"));
      return;
    }
  } catch (error) {
    console.log(error);
    response.render("404");
  }
};
