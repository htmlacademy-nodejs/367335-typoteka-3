'use strict';

const Joi = require(`joi`);
const {MaxValue, MinValue, USERNAME_PATTERN} = require(`../../constants`);

module.exports = Joi.object({
  firstName: Joi.string()
    .pattern(new RegExp(USERNAME_PATTERN))
    .max(MaxValue.FIRST_NAME)
    .required(),
  lastName: Joi.string()
    .pattern(new RegExp(USERNAME_PATTERN))
    .max(MaxValue.LAST_NAME)
    .required(),
  email: Joi.string()
    .email()
    .max(MaxValue.EMAIL)
    .required(),
  password: Joi.string()
    .min(MinValue.PASSWORD)
    .max(MaxValue.PASSWORD)
    .required(),
  passwordRepeated: Joi.string()
    .required()
    .valid(Joi.ref(`password`)),
  avatar: Joi.string()
    .max(MaxValue.FILENAME)
    .required()
});
