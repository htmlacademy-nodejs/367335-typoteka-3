'use strict';

const {Op} = require(`sequelize`);
const {Aliase} = require(`../models/common`);

class SearchService {
  constructor({models}) {
    this._Article = models.Article;
  }

  findAll(searchText) {
    return this._articles.filter((article) => article.title.includes(searchText));
  }

  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [Aliase.CATEGORIES]
    });
    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
