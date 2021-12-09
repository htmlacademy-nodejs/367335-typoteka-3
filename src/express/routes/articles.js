'use strict';

const {Router} = require(`express`);
const csrfProtection = require(`csurf`)({cookie: true});
const {StatusCodes} = require(`http-status-codes`);
const {modifyArticle, sendArticle, renderPostForm, getRouteData} = require(`../lib/articles`);
const auth = require(`../middlewares/auth`);
const upload = require(`../middlewares/upload`);
const {getUrlJson, getUrlError} = require(`../../utils`);
const api = require(`../api`).getAPI();

const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, async (req, res) => {
  const CategoryId = Number(req.params.id);
  const data = await getRouteData(req, CategoryId);

  const activeCategory = data.categories.find(({id}) => id === CategoryId);
  if (!activeCategory) {
    res.status(StatusCodes.NOT_FOUND).render(`400`);
  }

  res.render(`articles-by-category`, {
    ...data,
    activeCategory
  });
});

articlesRouter.get(`/add`, [auth(), csrfProtection], renderPostForm);

articlesRouter.get(`/edit/:id`, [auth(), csrfProtection], renderPostForm);

articlesRouter.post(`/add`, [
  auth(),
  upload.single(`picture`),
  csrfProtection
], sendArticle);

articlesRouter.post(`/edit/:id`, [
  auth(),
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
      errors: Object.values(JSON.parse(errors)),
      user,
      backUrl: req.headers.referer, // для кнопки "Назад"
      csrfToken: req.csrfToken() // для формы комментариев
    });
  } catch (err) {
    next();
  }
});

// Со страницы публикации постятся комментарии
articlesRouter.post(`/:id`, [auth(), csrfProtection], async (req, res) => {
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
    res.redirect(`/articles/${id}?payload=${getUrlJson(body) + getUrlError(err)}`);
  }
});

module.exports = articlesRouter;
