'use strict';

const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);

module.exports = (keysToCheck) => (req, res, next) => {
  const keys = Object.keys(req.body);
  const keysExists = keysToCheck.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
  }

  return next();
};
