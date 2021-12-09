'use strict';

const ArticlesService = require(`./articles`);
const CommentsService = require(`./comments`);
const CategoriesService = require(`./categories`);
const SearchService = require(`./search`);
const UsersService = require(`./users`);

module.exports = {
  ArticlesService,
  CommentsService,
  CategoriesService,
  SearchService,
  UsersService
};
