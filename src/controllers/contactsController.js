const Contact = require("../models/contactModel");

exports.index = (request, response) => {
  return response.render("contacts"); //o método render carrega uma página ejs.
};

exports.add = (request, response) => {
  response.render("addContact");
};

exports.addContact = async (request, response) => {
  try {
    const contact = new Contact(request.body);
    await contact.register();

    if (contact.errors.length) {
      request.flash("errors", contact.errors);
      request.session.save(() => response.redirect("back"));
      return;
    }

    if (contact.contact) {
      request.flash("success", "Contato criado com sucesso");
      request.session.save(() => response.redirect(`/contacts/edit/${contact.contact._id}`));
      return;
    }
  } catch (error) {
    console.log(error);
    response.render("404");
  }
};

exports.edit = async (request, response) => {
  const id = request.params.id;
  if (!id) return response.render("editErrorParam");

  try {
    const contact = await Contact.getUserById(id);

    response.render("editContact", { contact });
  } catch (error) {
    console.log(error);
    return response.render("editErrorParam");
  }
};

exports.editContact = async (request, response) => {
  const id = request.params.id;
  if (!id) return response.render("editErrorParam");

  try {
    const contact = new Contact(request.body);
    await contact.edit(id);

    if (contact.errors.length) {
      request.flash("errors", contact.errors);
      request.session.save(() => response.redirect("back"));
      return;
    }

    if (contact.contact) {
      request.flash("success", "contato editado com sucesso");
      request.session.save(() => response.redirect("/contacts"));
      return;
    }
  } catch (error) {
    console.log(error);
    return response.render("editErrorParam");
  }
};
