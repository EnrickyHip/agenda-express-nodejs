const Contact = require("../models/contactModel");

exports.index = async (request, response) => {
  const contacts = await Contact.getAllContacts();

  return response.render("contacts", { contacts }); //o método render carrega uma página ejs.
};

exports.add = (request, response) => {
  response.render("addContact", { values: {} });
};

exports.addContact = async (request, response) => {
  try {
    const contact = new Contact(request.body);
    await contact.register();

    if (contact.errors.length) {
      request.flash("errors", contact.errors);
      response.locals.errors = request.flash("errors");
      request.session.save(() => response.render("addContact", { values: request.body }));
      return;
    }

    if (contact.contact) {
      request.flash("success", "Contato criado com sucesso");
      request.session.save(() => response.redirect("/contacts"));
      return;
    }
  } catch (error) {
    console.log(error);
    response.render("404");
  }
};

exports.edit = async (request, response) => {
  const id = request.params.id;

  try {
    const contact = await Contact.getContactById(id);

    if (!contact) return response.render("editErrorParam", { values: {} });

    response.render("editContact", { values: contact });
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
      response.locals.errors = request.flash("errors");
      request.session.save(() => response.render("editContact", { values: { ...request.body, _id: id } }));
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

exports.delete = async (request, response) => {
  const id = request.params.id;

  try {
    const contact = await Contact.delete(id);
    if (contact) {
      request.flash("warnings", "contato apagado com sucesso");
      request.session.save(() => response.redirect("/contacts"));
      return;
    }

    return response.render("editErrorParam");
  } catch (error) {
    console.log(error);
    return response.render("editErrorParam");
  }
};

exports.contactExists = async (request, response) => {
  const contact = new Contact(request.body);
  let [emailExists, phoneExists] = await contact.contactExists();

  //se existir parametro significa que é o formulario de edição.
  if (request.params.id) {
    const id = request.params.id;

    const emailContactId = emailExists ? `${emailExists._id}` : id;
    const phoneContactId = phoneExists ? `${phoneExists._id}` : id;

    if (emailContactId === id) emailExists = false;
    if (phoneContactId === id) phoneExists = false;
  }

  response.send([!!emailExists, !!phoneExists]);
};
