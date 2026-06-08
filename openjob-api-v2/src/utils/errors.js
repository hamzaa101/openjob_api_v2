class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);

    this.name = 'ClientError';
    this.statusCode = statusCode;
  }
}

class InvariantError extends ClientError {
  constructor(message) {
    super(message, 400);

    this.name = 'InvariantError';
  }
}

class AuthenticationError extends ClientError {
  constructor(message = 'Authentication gagal') {
    super(message, 401);

    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends ClientError {
  constructor(message = 'Anda tidak berhak mengakses resource ini') {
    super(message, 403);

    this.name = 'AuthorizationError';
  }
}

class NotFoundError extends ClientError {
  constructor(message = 'Resource tidak ditemukan') {
    super(message, 404);

    this.name = 'NotFoundError';
  }
}

module.exports = {
  ClientError,
  InvariantError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
};