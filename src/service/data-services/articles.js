'use strict';

const {Aliase: {CATEGORIES, COMMENTS}} = require(`../models/common`);

const getInclude = (comments) => {
  const include = [CATEGORIES];
  if (Number(comments)) {
    include.push(COMMENTS);
  }
  return include;
};

class ArticlesService {
  constructor({models}) {
    this._Article = models.Article;
    this._Comment = models.Comment;
    this._Category = models.Category;
    this.entityName = `article`;
  }

  async findAll(comments = 0) {
    const articles = await this._Article.findAll({
      include: getInclude(comments)
    });
    return articles.map((item) => item.get());
  }

  async findPage({limit = 0, offset = 0, comments = 0}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: getInclude(comments),
      distinct: true
    });
    return {count, articles: rows};
  }

  async findOne({id, comments = 0}) {
    const article = await this._Article.findByPk(id, {include: getInclude(comments)});
    if (article) {
      return article.get({plain: true});
    }
    return article;
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
