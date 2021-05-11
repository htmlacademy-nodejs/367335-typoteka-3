'use strict';

const {Router} = require(`express`);
const {modifyArticle} = require(`../lib/articles`);

const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles(),
    api.getCategories(true)
  ]);
  res.render(`main`, {articles: articles.map(modifyArticle), categories});
});

mainRouter.get(`/categories`, (req, res) => {
  res.render(`all-categories`);
});

mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;
  try {
    const results = await api.search(query);
    res.render(`search`, {results: results.map((article) => {
      return modifyArticle(article, query);
    }), query});
  } catch (error) {
    res.render(`search`, {results: [], query});
  }
});

mainRouter.get(`/login`, (req, res) => {
  res.render(`login`);
});

mainRouter.get(`/register`, (req, res) => {
  res.render(`sign-up`);
});

module.exports = mainRouter;
