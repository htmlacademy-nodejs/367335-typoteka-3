'use strict';

const {Aliase: {ARTICLE_CATEGORIES}} = require(`../models/common`);

class CategoriesService {
  constructor(sequelize) {
    const {models} = sequelize;
    this._Category = models.Category;
    this._ArticleCategory = models.ArticleCategory;

    this._sequelize = sequelize;
    this.entityName = `category`;
  }

  async create(title) {
    return await this._Category.create({title});
  }

  async drop(id) {
    const categoryWithArticles = await this.findOne({id, needCount: true});
    if (categoryWithArticles) {
      return {message: `Нельзя удалить категорию с публикациями!`};
    }

    const deletedRows = await this._Category.destroy({where: {id}});

    return Boolean(deletedRows);
  }

  async findAll(needCount) {
    if (!needCount) {
      return this._Category.findAll({
        attributes: [`id`, `title`],
        order: [[`title`, `asc`]],
        raw: true
      });
    }

    const result = await this._Category.findAll({
      attributes: [`id`, `title`, [this._sequelize.fn(`COUNT`, `*`), `count`]],
      group: [this._sequelize.col(`Category.id`)],
      order: [[`title`, `asc`]],
      include: [{
        model: this._ArticleCategory,
        as: ARTICLE_CATEGORIES,
        required: true,
        attributes: []
      }]
    });
    return result.map((it) => it.get());
  }

  async findOne({id, needCount = false}) {
    const options = [id];
    if (needCount) {
      options.push({
        include: [{
          model: this._ArticleCategory,
          as: ARTICLE_CATEGORIES,
          required: true
        }]
      });
    }

    return await this._Category.findByPk(...options);
  }

  async update(id, title) {
    const [affectedRows] = await this._Category.update({title}, {where: {id}});

    return Boolean(affectedRows);
  }
}

module.exports = CategoriesService;
