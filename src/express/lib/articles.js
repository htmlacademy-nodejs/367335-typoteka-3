'use strict';

// Набор общих функций для работы с публикациями

const {StatusCodes} = require(`http-status-codes`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);
const {ensureArray, getUrlJson, getUrlError} = require(`../../utils`);
const api = require(`../api`).getAPI();
const dayjs = require(`dayjs`);

const setDates = (entity, dateKey = `createdAt`) => {
  const date = entity[dateKey] ? dayjs(entity[dateKey]) : dayjs();

  entity.date = date.format(`YYYY-MM-DDTHH:mm`);
  entity.shortDate = date.format(`YYYY-MM-DD`);
  entity.outputDate = date.format(`DD.MM.YYYY, HH:mm`);
};

// Доработка одиночной публикации для шаблонизации
const modifyArticle = (article, query = ``) => {
  if (!article.Categories) {
    article.Categories = [];
  }

  setDates(article, `pubDate`);

  if (article.Comments) {
    article.Comments.forEach((comment) => setDates(comment));
  }

  article.fullTextParts = `${article.announce}\n${article.fullText}`.split(`\n`);

  if (query) {
    article.title = article.title.replace(query, `<b>${query}</b>`);
  }

  return article;
};

// Отправляет объявление и предзаполняет доп. данные для форм из адресной строки
const sendArticle = async (req, res) => {
  const {body, file, params: {id = null}, session: {user}} = req;
  const context = `/articles/${id ? `edit/${id}` : `add`}`;
  const date = body.date ? dayjs(body.date, `YYYY-MM-DD`) : dayjs();
  const data = {
    ...body,
    pubDate: date.format(`YYYY-MM-DD HH:mm:ss`),
    picture: file ? file.filename : body.pictureUploaded || ``, // если пользователь не загрузил новую картинку, оставляем прежнюю
    Categories: ensureArray(body.Categories).map(Number).filter(Boolean),
    UserId: user.id
  };
  delete data._csrf;
  delete data.date;
  delete data.pictureUploaded;

  try {
    if (id) {
      await api.updateArticle(id, data);
      res.redirect(context);
    } else {
      await api.createArticle(data);
      res.status(StatusCodes.CREATED).redirect(`/my`);
    }
  } catch (err) {
    res.redirect(`${context}?payload=${getUrlJson(data) + getUrlError(err)}`);
  }
};

const renderPostForm = async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {payload = `{}`, errors = `{}`} = req.query;
  const categories = await api.getCategories();
  let article = JSON.parse(payload);

  if (id) {
    const existedArticle = await api.getArticle({id});
    existedArticle.Categories = existedArticle.Categories.map((category) => category.id);
    article = {...existedArticle, ...article};
  }

  res.render(`post-form`, {
    article: modifyArticle(article),
    categories,
    errors: Object.values(JSON.parse(errors)),
    user,
    csrfToken: req.csrfToken()
  });
};

const getRouteData = async (req, CategoryId = null) => {
  let {page = 1} = req.query;
  page = Number(page);

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const {user} = req.session;

  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({offset, limit, comments: 1, CategoryId}),
    api.getCategories(1)
  ]);

  return {
    articles: articles.map(modifyArticle),
    categories,
    page,
    totalPages: Math.ceil(count / limit),
    user
  };
};

module.exports = {
  modifyArticle,
  renderPostForm,
  setDates,
  sendArticle,
  getRouteData
};
