'use strict';

// Набор общих функций для работы с публикациями

const dayjs = require(`dayjs`);

// Доработка одиночной публикации для шаблонизации
const modifyArticle = (article, query = ``) => {
  const pubDate = dayjs(article.pubDate);

  article.fullTextParts = article.fullText.split(`\n`);
  article.date = pubDate.format(`YYYY-MM-DDTHH:mm`);
  article.outputDate = pubDate.format(`DD.MM.YYYY, HH:mm`);
  article.categories = article.category.split(`\n`);

  if (query) {
    article.title = article.title.replace(query, `<b>${query}</b>`);
  }

  return article;
};

// Получение "плоского" списка комментариев из списка статей
const getCommentsList = (articles) => articles.reduce((acc, article) => {
  article.comments.forEach((comment) => {
    acc.push({
      ...comment,
      articleId: article.id,
      articleTitle: article.title
    });
  });
  return acc;
}, []);

// Обработка данных публикации для постинга
const preprocessPostedArticle = ({body, file = {}}) => {
  const date = body.date ? dayjs(body.date, `DD.MM.YYYY`) : dayjs();
  const data = {
    title: body.title,
    announce: body.announce,
    fullText: body.text,
    pubDate: date.format(`YYYY-MM-DD HH:mm:ss`),
    comments: []
  };
  if (file.filename) {
    data.picture = file.filename;
  }
  if (body.categories) {
    data.category = body.categories.join(`\n`);
  }
  return data;
};

module.exports = {
  getCommentsList,
  modifyArticle,
  preprocessPostedArticle
};
