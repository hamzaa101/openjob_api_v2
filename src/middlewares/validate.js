const { InvariantError } = require('../utils/errors');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return next(new InvariantError(message));
    }

    req.body = value;
    return next();
  };
};

module.exports = validate;