'use strict';

const Joi = require(`joi`);
const {MinValue, MaxValue} = require(`../../constants`);

module.exports = Joi.object({
  title: Joi.string()
    .min(MinValue.CATEGORY)
    .max(MaxValue.CATEGORY)
    .required()
});
