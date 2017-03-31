import ApiError from './error';

export class ModelNotFoundError extends ApiError {
  constructor(id) {
    super({
      statusCode: 404,
      error: {
        type: 'notfound',
        description: 'Model not found',
        message: `Model with id ${id} not found`,
      },
    });
  }
}

export class ForbiddenError extends ApiError {
  constructor(message) {
    super({
      statusCode: 403,
      error: {
        type: 'forbidden',
        description: 'Forbidden error',
        message: message || 'You are not authorized to make this request',
      },
    });
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message) {
    super({
      statusCode: 401,
      error: {
        type: 'unauthorized',
        description: 'Unauthorized error',
        message: message || 'You must login to make this request',
      },
    });
  }
}

export class ValidationError extends ApiError {
  constructor(messages) {
    super({
      statusCode: 400,
      error: {
        type: 'validation',
        description: 'Validation error',
        message: 'Fix these validation errors first',
        errors: messages,
      },
    });
  }
}

export class BadRequestError extends ApiError {
  constructor(message) {
    super({
      statusCode: 400,
      error: {
        type: 'badrequest',
        message: message || 'Bad request',
      },
    });
  }
}

export class ShopRequiredError extends ValidationError {
  constructor() {
    super({ shop: 'Shop is required to make this request' });
  }
}

export class StripeError extends ApiError {
  constructor(message) {
    super({
      statusCode: 500,
      error: {
        type: 'stripe',
        description: 'Stripe error',
        message: message || 'Something went wrong, That is all we know!',
      },
    });
  }
}

export default {
  ApiError,
  ModelNotFoundError,
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
  BadRequestError,
  ShopRequiredError,
  StripeError,
};
