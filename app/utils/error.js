export const getErrorsByStatus = (status) => {
  const validationErrors = {};
  if (status.toJS) {
    status = status.toJS(); // eslint-disable-line no-param-reassign
  }

  if (status.error) {
    let errors;
    if (status.error && status.error.isValidationError()) {
      errors = status.error.getValidationErrors();
    }

    for (const key in errors) { // eslint-disable-line no-restricted-syntax
      if (errors[key]) {
        validationErrors[key] = errors[key].message || errors[key];
      }
    }
  }
  return validationErrors;
};
