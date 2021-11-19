'use strict';

const {Router} = require(`express`);
const {modifyArticle} = require(`../lib/articles`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);
const {getUrlJson} = require(`../../utils`);
const auth = require(`../middlewares/auth`);
const upload = require(`../middlewares/upload`);

const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = Number(page);

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const {user} = req.session;

  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({offset, limit, comments: 1}),
    api.getCategories(true)
  ]);

  res.render(`main`, {
    articles: articles.map(modifyArticle),
    categories,
    page,
    totalPages: Math.ceil(count / limit),
    user
  });
});

mainRouter.get(`/categories`, auth(), async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories, user});
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  const {query} = req.query;

  try {
    const results = await api.search(query);
    res.render(`search`, {
      results: results.map((article) => modifyArticle(article, query)),
      query,
      user
    });
  } catch (err) {
    res.render(`search`, {results: [], query, user});
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {payload = `{}`, errors = `{}`} = req.query;

  res.render(`login`, {
    payload: JSON.parse(payload),
    errors: JSON.parse(errors)
  });
});

mainRouter.post(`/login`, async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await api.auth(email, password);
    req.session.user = user;
    req.session.save(() => res.redirect(`/`));
  } catch (err) {
    const errorText = err.response ? err.response.data : err.message;
    res.redirect(`/login?payload=${getUrlJson({email})}&errors=${getUrlJson(errorText)}`);
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  req.session.save(() => res.redirect(`/login`));
});

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  const {payload = `{}`, errors = `{}`} = req.query;

  res.render(`sign-up`, {
    payload: JSON.parse(payload),
    errors: JSON.parse(errors),
    user
  });
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    ...body,
    avatar: file ? file.filename : body.pictureUploaded // если пользователь не загрузил новую картинку, оставляем прежнюю
  };
  delete userData.pictureUploaded;

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (err) {
    const errorText = err.response ? err.response.data : err.message;
    res.redirect(`/register?payload=${getUrlJson(userData)}&errors=${getUrlJson(errorText)}`);
  }
});

module.exports = mainRouter;
