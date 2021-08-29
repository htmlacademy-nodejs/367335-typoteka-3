'use strict';

const Joi = require(`joi`);
const {MaxValue, MinValue} = require(`../../constants`);

module.exports = Joi.object({
  title: Joi.string()
    .min(MinValue.TITLE)
    .max(MaxValue.TITLE)
    .required(),
  announce: Joi.string()
    .min(MinValue.ANNOUNCE)
    .max(MaxValue.ANNOUNCE)
    .required(),
  fullText: Joi.string()
    .min(MinValue.TEXT)
    .max(MaxValue.TEXT)
    .required(),
  pubDate: Joi.date()
    .required(),
  picture: Joi.string()
    .max(MaxValue.FILENAME)
    .allow(``)
    .required(),
  Categories: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required(),
  UserId: Joi.number()
    .integer()
    .positive(1)
    .required()
});
