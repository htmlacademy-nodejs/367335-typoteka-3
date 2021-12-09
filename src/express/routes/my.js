'use strict';

const {Router} = require(`express`);
const csrfProtection = require(`csurf`)({cookie: true});
const {setDates, modifyArticle} = require(`../lib/articles`);
const {getUrlError} = require(`../../utils`);
const auth = require(`../middlewares/auth`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, [auth(), csrfProtection], async (req, res) => {
  const {user} = req.session;
  const {id, errors = `{}`} = req.query;
  const articles = await api.getArticles();

  res.render(`my`, {
    articles: articles.map(modifyArticle),
    user,
    errors: JSON.parse(errors),
    affectedId: id,
    csrfToken: req.csrfToken() // для форм удаления статей
  });
});

myRouter.post(`/`, [auth(), csrfProtection], async (req, res) => {
  const {id} = req.body;
  delete req.body._csrf;

  try {
    await api.dropArticle(id);
    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`/my?id=${id + getUrlError(err)}`);
  }
});

myRouter.get(`/comments`, [auth(), csrfProtection], async (req, res) => {
  const {user} = req.session;
  const {id, errors = `{}`} = req.query;
  const comments = await api.getComments();

  comments.forEach((comment) => setDates(comment));
  console.log(errors);

  res.render(`comments`, {
    comments,
    user,
    errors: JSON.parse(errors),
    affectedId: id,
    csrfToken: req.csrfToken() // для форм удаления комментариев
  });
});

myRouter.post(`/comments`, [auth(), csrfProtection], async (req, res) => {
  const {articleId, commentId} = req.body;
  delete req.body._csrf;

  try {
    await api.dropComment(articleId, commentId);
    res.redirect(`/my/comments`);
  } catch (err) {
    res.redirect(`/my/comments?id=${commentId + getUrlError(err)}`);
  }
});

module.exports = myRouter;
