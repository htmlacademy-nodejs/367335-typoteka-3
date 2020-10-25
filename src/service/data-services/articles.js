'use strict';

const {GENERATED_ID_LENGTH} = require(`../../constants`);
const {nanoid} = require(`nanoid`);

class ArticlesService {
  constructor(articles) {
    this._articles = articles;
    this.entityName = `article`;
  }

  findAll() {
    return this._articles;
  }

  findOne(articleId) {
    return this._articles.find((item) => item.id === articleId);
  }

  create(articleBody) {
    const newArticle = {
      id: nanoid(GENERATED_ID_LENGTH),
      ...articleBody
    };
    this._articles.push(newArticle);
    return newArticle;
  }

  update(articleId, articleBody) {
    const oldArticle = this.findOne(articleId);
    return Object.assign(oldArticle, articleBody);
  }

  drop(articleId) {
    const deletedArticle = this.findOne(articleId);
    this._articles = this._articles.filter((item) => item.id !== articleId);
    return deletedArticle;
  }
}

module.exports = ArticlesService;
