'use strict';

class CategoriesService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, article) => {
      const articleCategories = article.category.split(`\n`);
      articleCategories.forEach((item) => acc.add(item));
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoriesService;
