'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  articleId: Joi.number()
    .integer()
    .positive(),
  commentId: Joi.number()
    .integer()
    .positive()
    .optional()
});
