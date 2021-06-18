'use strict';

const {Router} = require(`express`);
const {getCommentsList, modifyArticle} = require(`../lib/articles`);

const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {articles: articles.map(modifyArticle)});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles({comments: 1});
  res.render(`comments`, {comments: getCommentsList(articles.slice(0, 3))});
});

module.exports = myRouter;
