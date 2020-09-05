'use strict';

const {Services: {ARTICLES}} = require(`../../constants`);
const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/add`, (req, res) => {
  res.send(`/${ARTICLES.alias}/add`);
});

articlesRouter.get(`/:id`, (req, res) => {
  res.send(`/${ARTICLES.alias}/:id`);
});

articlesRouter.get(`/category/:id`, (req, res) => {
  res.send(`/${ARTICLES.alias}/category/:id`);
});

articlesRouter.get(`/edit/:id`, (req, res) => {
  res.send(`/${ARTICLES.alias}/edit/:id`);
});

module.exports = articlesRouter;
