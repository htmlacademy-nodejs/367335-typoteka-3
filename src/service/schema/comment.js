'use strict';

const Joi = require(`joi`);
const {MaxValue, MinValue} = require(`../../constants`);

module.exports = Joi.object({
  text: Joi.string()
    .min(MinValue.COMMENT)
    .max(MaxValue.COMMENT)
    .required(),
  PersonId: Joi.number()
    .integer()
    .min(1)
    .required()
});
