export const addInvalid = (element) => {
  element.classList.remove("is-valid");
  element.classList.add("is-invalid");
};

export const addValid = (element) => {
  element.classList.remove("is-invalid");
  element.classList.add("is-valid");
};

export const removeValidation = (element) => {
  element.classList.remove("is-invalid");
  element.classList.remove("is-valid");
};
