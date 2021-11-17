'use strict';

const {Router} = require(`express`);
const {getCommentsList, modifyArticle} = require(`../lib/articles`);
const auth = require(`../middlewares/auth`);

const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`, auth(), async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();

  res.render(`my`, {
    articles: articles.map(modifyArticle),
    user
  });
});

myRouter.get(`/comments`, auth(), async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: 1});

  res.render(`comments`, {
    comments: getCommentsList(articles.slice(0, 3)),
    user
  });
});

module.exports = myRouter;
