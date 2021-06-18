'use strict';

const defineModels = require(`../models`);
const {Aliase: {COMMENTS}} = require(`../models/common`);

module.exports = async (sequelize, {categories, articles, people}) => {
  const {Category, Article, People} = defineModels(sequelize);

  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(categories);

  const categoryIdByTitle = categoryModels.reduce((acc, next) => ({
    [next.title]: next.id,
    ...acc
  }), {});

  await People.bulkCreate(people);

  await Promise.all(articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [COMMENTS]});
    await articleModel.addCategories(article.categories.map((title) => categoryIdByTitle[title]));
  }));
};
