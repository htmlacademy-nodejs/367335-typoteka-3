'use strict';

const {StatusCodes} = require(`http-status-codes`);

module.exports = (schema, checkParams = false, abortEarly = false) => {
  return async ({params, body}, res, next) => {
    try {
      await schema.validateAsync(checkParams ? params : body, {abortEarly});
    } catch ({details}) {
      const errors = {};
      for (const {context, message} of details) {
        errors[context.key] = message;
      }
      return res.status(StatusCodes.BAD_REQUEST).send(errors);
    }

    return next();
  };
};
