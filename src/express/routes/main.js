'use strict';

const {Router} = require(`express`);
const {modifyArticle} = require(`../lib/articles`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);
const upload = require(`../middlewares/upload`);

const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = Number(page);

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({offset, limit, comments: 1}),
    api.getCategories(true)
  ]);

  res.render(`main`, {
    articles: articles.map(modifyArticle),
    categories,
    page,
    totalPages: Math.ceil(count / limit)
  });
});

mainRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories});
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
  const {payload = `{}`, errors = `{}`} = req.query;
  res.render(`login`, {
    payload: JSON.parse(payload),
    errors: JSON.parse(errors)
  });
});

mainRouter.get(`/register`, (req, res) => {
  const {payload = `{}`, errors = `{}`} = req.query;

  res.render(`sign-up`, {
    payload: JSON.parse(payload),
    errors: JSON.parse(errors)
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
    // передаем ранее заполненные данные для пробрасывания в форму
    const payloadStr = encodeURIComponent(JSON.stringify(userData));

    const errorStr = encodeURIComponent(JSON.stringify(err.response.data));

    res.redirect(`/register?payload=${payloadStr}&errors=${errorStr}`);
  }
});

module.exports = mainRouter;
