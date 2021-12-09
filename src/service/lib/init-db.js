'use strict';

const defineModels = require(`../models/main`);
const {Aliase: {COMMENTS, ARTICLES, USERS}} = require(`../models/common`);

module.exports = async (sequelize, {categories, articles, users} = {}) => {
  const {Category, Article, User} = defineModels(sequelize);

  await sequelize.sync({force: true});

  if (!categories) {
    // инициализируем пустую БД
    return;
  }

  const categoryModels = await Category.bulkCreate(categories);

  const categoryIdByTitle = categoryModels.reduce((acc, next) => ({
    [next.title]: next.id,
    ...acc
  }), {});

  await User.bulkCreate(users, {include: [ARTICLES, COMMENTS]});

  await Promise.all(articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [COMMENTS, USERS]});
    await articleModel.addCategories(article.categories.map((title) => categoryIdByTitle[title]));
  }));
};
