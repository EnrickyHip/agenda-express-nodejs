//this module transform in a empty strings all the values which are not a string
module.exports = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] !== "string") {
      obj[key] = ""; //transforma o valor da chave em uma string vazia caso não seja uma
    }
  }

  return obj;
};
