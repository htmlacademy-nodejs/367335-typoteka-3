'use strict';

// Набор общих функций для работы с публикациями

const {StatusCodes} = require(`http-status-codes`);
const {ensureArray, getUrlJson} = require(`../../utils`);
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

  if (article.fullText) {
    article.fullTextParts = article.fullText.split(`\n`);
  }

  if (query) {
    article.title = article.title.replace(query, `<b>${query}</b>`);
  }

  return article;
};

// Получение "плоского" списка комментариев из списка статей
const getCommentsList = (articles) => articles.reduce((acc, article) => {
  article.Comments.forEach((comment) => {
    setDates(comment);

    acc.push({
      ...comment,
      articleId: article.id,
      articleTitle: article.title
    });
  });
  return acc;
}, []);

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
    const errorText = err.response ? err.response.data : err.message;
    res.redirect(`${context}?payload=${getUrlJson(data)}&errors=${getUrlJson(errorText)}`);
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
    errors: JSON.parse(errors),
    user,
    csrfToken: req.csrfToken()
  });
};

module.exports = {
  getCommentsList,
  modifyArticle,
  renderPostForm,
  sendArticle
};
