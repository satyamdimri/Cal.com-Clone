const { z } = require('zod');

module.exports = (schema, source = 'body') => (req, _res, next) => {
  try {
    req.validated = schema.parse(req[source]);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next({
        statusCode: 400,
        message: 'Validation failed',
        details: error.issues,
      });
    }

    return next(error);
  }
};
