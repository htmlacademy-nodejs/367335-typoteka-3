'use strict';

const {Router} = require(`express`);
const articles = require(`./articles`);
const categories = require(`./categories`);
const search = require(`./search`);
const getMockData = require(`../lib/get-mock-data`);
const {
  ArticlesService,
  CommentsService,
  CategoriesService,
  SearchService
} = require(`../data-services`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  articles(app, new ArticlesService(mockData), new CommentsService(mockData));
  categories(app, new CategoriesService(mockData));
  search(app, new SearchService(mockData));
})();

module.exports = app;
