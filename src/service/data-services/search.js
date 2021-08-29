'use strict';

const {Op} = require(`sequelize`);
const {Aliase: {CATEGORIES}} = require(`../models/common`);
const UserRelatedService = require(`./user-related`);

class SearchService extends UserRelatedService {
  constructor({models}) {
    super({models});

    this._Article = models.Article;
  }

  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [CATEGORIES, this._userInclusion]
    });
    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
