'use strict';

const {DataTypes: {CHAR, STRING, DATE, NOW, SMALLINT}} = require(`sequelize`);

module.exports = {
  Aliase: {
    COMMENTS: `Comments`,
    ARTICLES: `Articles`,
    CATEGORIES: `Categories`,
    ARTICLE_CATEGORIES: `ArticleCategories`,
    PEOPLE: `People`
  },
  DATE,
  NOW,
  SMALLINT,
  setChar: CHAR,
  setVarchar: STRING
};
