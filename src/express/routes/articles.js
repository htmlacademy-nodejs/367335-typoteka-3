'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);
const {modifyArticle, sendArticle, renderPostForm} = require(`../lib/articles`);
const upload = require(`../middlewares/upload`);
const articlesRouter = new Router();
const api = require(`../api`).getAPI();

articlesRouter.get(`/category/:id`, (req, res) => {
  const {id} = req.params;
  const article = api.getArticle({id, comments: 1});
  res.render(`articles-by-category`, {article});
});

articlesRouter.get(`/add`, renderPostForm);
articlesRouter.get(`/edit/:id`, renderPostForm);

articlesRouter.post(`/add`, upload.single(`picture`), sendArticle);
articlesRouter.post(`/edit/:id`, upload.single(`picture`), sendArticle);

articlesRouter.get(`/:id`, async (req, res, next) => {
  const {payload = `{}`, errors = `{}`} = req.query;
  const {id} = req.params;

  try {
    const article = await api.getArticle({id, comments: 1});
    res.render(`post`, {
      article: modifyArticle(article),
      payload: JSON.parse(payload),
      errors: JSON.parse(errors)
    });
  } catch (err) {
    next();
  }
});

articlesRouter.post(`/:id`, async (req, res) => {
  const {body, params: {id}} = req;

  try {
    await api.createComment(id, {
      ...body,
      PersonId: 1 // временная заглушка для прохождения валидации
    });
    res.status(StatusCodes.CREATED).redirect(`/articles/${id}`);
  } catch (err) {
    // передаем ранее заполненные данные для пробрасывания в форму
    const payloadStr = encodeURIComponent(JSON.stringify(body));

    const errorStr = encodeURIComponent(JSON.stringify(err.response.data));

    res.redirect(`/articles/${id}?payload=${payloadStr}&errors=${errorStr}`);
  }
});

module.exports = articlesRouter;
