'use strict';

const Sequelize = require(`sequelize`);
const {Aliase} = require(`../models/common`);

class CategoriesService {
  constructor({models}) {
    this._Category = models.Category;
    this._ArticleCategory = models.ArticleCategory;
  }

  async findAll(needCount) {
    if (!needCount) {
      return this._Category.findAll({raw: true});
    }

    const result = await this._Category.findAll({
      attributes: [`id`, `title`, [Sequelize.fn(`COUNT`, `*`), `count`]],
      group: [Sequelize.col(`Category.id`)],
      include: [{
        model: this._ArticleCategory,
        as: Aliase.ARTICLE_CATEGORIES,
        attributes: []
      }]
    });
    return result.map((it) => it.get());
  }
}

module.exports = CategoriesService;
