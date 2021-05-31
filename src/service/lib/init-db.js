'use strict';

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {categories, articles, peoples}) => {
  const {Category, Article, People} = defineModels(sequelize);

  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(categories);

  const categoryIdByTitle = categoryModels.reduce((acc, next) => ({
    [next.title]: next.id,
    ...acc
  }), {});

  await People.bulkCreate(peoples);

  await Promise.all(articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Aliase.COMMENTS]});
    await articleModel.addCategories(article.categories.map((title) => categoryIdByTitle[title]));
  }));
};
