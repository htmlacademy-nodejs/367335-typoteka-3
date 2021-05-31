'use strict';

const Aliase = require(`../models/aliase`);

class ArticlesService {
  constructor({models}) {
    this._Article = models.Article;
    this._Comment = models.Comment;
    this._Category = models.Category;
    this.entityName = `article`;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push(Aliase.COMMENTS);
    }
    const articles = await this._Article.findAll({include});
    return articles.map((item) => item.get());
  }

  async findOne(articleId) {
    return this._Article.findByPk(articleId, {include: Aliase.CATEGORIES});
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async update(id, articleBody) {
    const [affectedRows] = await this._Article.update(articleBody, {
      where: {id}
    });
    return Boolean(affectedRows);
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = ArticlesService;
