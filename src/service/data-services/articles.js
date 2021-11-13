'use strict';

const {Aliase: {CATEGORIES, COMMENTS}} = require(`../models/common`);
const UserRelatedService = require(`./user-related`);

class ArticlesService extends UserRelatedService {
  constructor({models}) {
    super({models});

    this._Article = models.Article;
    this._Comment = models.Comment;
    this._Category = models.Category;
    this.entityName = `article`;

    this._commentInclusion = {
      model: this._Comment,
      as: COMMENTS,
      include: [this._userInclusion]
    };
  }

  _getInclude(comments) {
    const include = [CATEGORIES, this._userInclusion];

    if (Number(comments)) {
      include.push(this._commentInclusion);
    }

    return include;
  }

  async findAll(comments = 0) {
    const articles = await this._Article.findAll({
      include: this._getInclude(comments),
      // order: [[{model: this._Comment, as: COMMENTS}, `createdAt`, `desc`]]
    });
    return articles.map((item) => item.get());
  }

  async findPage({limit = 0, offset = 0, comments = 0}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: this._getInclude(comments),
      distinct: true
    });
    return {count, articles: rows};
  }

  async findOne({id, comments = 0}) {
    const article = await this._Article.findByPk(id, {
      include: this._getInclude(comments),
      // order: [[{model: this._Comment, as: COMMENTS}, `createdAt`, `desc`]]
    });
    if (article) {
      return article.get({plain: true});
    }
    return article;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.Categories);
    return article.get();
  }

  async update(id, articleData) {
    const [affectedRows] = await this._Article.update(articleData, {
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
