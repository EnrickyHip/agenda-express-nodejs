//this module checks if the user given exists
module.exports = async (email, model) => {
  return await model.findOne({ email: email });
};
