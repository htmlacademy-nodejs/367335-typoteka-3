'use strict';

const article = require(`./article`);
const category = require(`./category`);
const comment = require(`./comment`);
const user = require(`./user`);
const articleRouteParams = require(`./article-route-params`);
const categoryRouteParams = require(`./category-route-params`);

module.exports = {
  article,
  category,
  comment,
  user,
  articleRouteParams,
  categoryRouteParams
};
