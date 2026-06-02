const ApiError = require('../utils/ApiError');

/**
 * Joi validation middleware factory.
 * schema: { body?, query?, params? } each a Joi schema.
 */
function validate(schema) {
  return (req, res, next) => {
    const targets = ['body', 'query', 'params'];
    const errors = [];
    for (const key of targets) {
      if (!schema[key]) continue;
      const { error, value } = schema[key].validate(req[key], {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        errors.push(...error.details.map((d) => d.message));
      } else {
        req[key] = value;
      }
    }
    if (errors.length) return next(new ApiError(400, 'Validation failed', errors));
    next();
  };
}

module.exports = validate;
