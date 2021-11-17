'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const {StatusCodes} = require(`http-status-codes`);
const {modifyArticle, sendArticle, renderPostForm} = require(`../lib/articles`);
const auth = require(`../middlewares/auth`);
const upload = require(`../middlewares/upload`);
const {getUrlJson} = require(`../../utils`);
const api = require(`../api`).getAPI();

const articlesRouter = new Router();
const csrfProtection = csrf({cookie: true});

articlesRouter.get(`/category/:id`, (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const article = api.getArticle({id, comments: 1});

  res.render(`articles-by-category`, {article, user});
});

articlesRouter.get(`/add`, [
  auth,
  csrfProtection
], renderPostForm);
articlesRouter.get(`/edit/:id`, [
  auth,
  csrfProtection
], renderPostForm);

articlesRouter.post(`/add`, [
  auth,
  upload.single(`picture`),
  csrfProtection
], sendArticle);
articlesRouter.post(`/edit/:id`, [
  auth,
  upload.single(`picture`),
  csrfProtection
], sendArticle);

articlesRouter.get(`/:id`, csrfProtection, async (req, res, next) => {
  const {user} = req.session;
  const {payload = `{}`, errors = `{}`} = req.query;
  const {id} = req.params;

  try {
    const article = await api.getArticle({id, comments: 1});
    res.render(`post`, {
      article: modifyArticle(article),
      payload: JSON.parse(payload),
      errors: JSON.parse(errors),
      user,
      csrfToken: req.csrfToken() // для формы комментариев
    });
  } catch (err) {
    next();
  }
});

// Со страницы публикации постятся комментарии
articlesRouter.post(`/:id`, [
  auth,
  csrfProtection
], async (req, res) => {
  const {user} = req.session;
  const {body, params: {id}} = req;

  delete body._csrf;

  try {
    await api.createComment(id, {
      ...body,
      UserId: user.id
    });
    res.status(StatusCodes.CREATED).redirect(`/articles/${id}`);
  } catch (err) {
    const errorText = err.response ? err.response.data : err.message;
    res.redirect(`/articles/${id}?payload=${getUrlJson(body)}&errors=${getUrlJson(errorText)}`);
  }
});

module.exports = articlesRouter;
