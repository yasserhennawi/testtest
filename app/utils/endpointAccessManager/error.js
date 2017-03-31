export default class ApiError {
  constructor(err) {
    this.err = this.formatError(err);
  }

  formatError(err) {
    if (typeof err === 'string') {
      err = { // eslint-disable-line no-param-reassign
        statusCode: 500,
        error: {
          message: err,
        },
      };
    }

    if (!err.statusCode) {
      err.statusCode = 500; // eslint-disable-line no-param-reassign
    }

    if (!err.error) {
      err.error = {}; // eslint-disable-line no-param-reassign
    }

    if (!err.error.message) {
      err.error.message = 'Unknown error'; // eslint-disable-line no-param-reassign
    }

    if (!err.error.type) {
      err.error.type = 'Unknown';  // eslint-disable-line no-param-reassign
    }

    return err;
  }

  getStatusCode() {
    return this.err.statusCode;
  }

  getMainErrorMessage() {
    return this.err.error.message;
  }

  getValidationErrors() {
    return this.err.error.errors;
  }

  hasValidationError(key) {
    return this.isValidationError() && !!this.err.error.errors[key];
  }

  getValidationError(key) {
    if (this.isValidationError()) {
      return this.err.error.errors[key];
    }
    return {};
  }

  getErrorMessages() {
    if (this.isValidationError()) {
      return this.getValidationErrorMessages();
    }
    return [this.getMainErrorMessage()];
  }

  getValidationErrorMessages() {
    const errors = this.err.error.errors;
    const messages = [];

    errors.forEach((error) => {
      messages.push(errors[error].message || errors[error]);
    });

    return messages;
  }

  isValidationError() {
    return this.err.error.type === 'validation';
  }

  isBadRequestError() {
    return this.err.error.type === 'badrequest';
  }

  isNotFoundError() {
    return this.err.error.type === 'notfound';
  }

  isUnauthorizedError() {
    return this.err.error.type === 'unauthorized';
  }

  isForbiddenError() {
    return this.err.error.type === 'forbidden';
  }

  isUnknownError() {
    return this.err.error.type === 'unknown';
  }

  isInvalidToken() {
    return this.err.error.message === 'Invalid token';
  }
}
