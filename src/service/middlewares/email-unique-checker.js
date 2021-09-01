'use strict';

const {StatusCodes} = require(`http-status-codes`);

module.exports = (service) => async ({body}, res, next) => {
  const userByEmail = await service.findByEmail(body.email);
  if (userByEmail) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      email: `Email is already in use`
    });
  }

  return next();
};
