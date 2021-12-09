'use strict';

const defineUser = require(`./user`);
const defineArticle = require(`./article`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticleCategory = require(`./article-category`);
const {Aliase: {ARTICLES, CATEGORIES, COMMENTS, ARTICLE_CATEGORIES, USERS}} = require(`./common`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);

  Article.hasMany(Comment, {as: COMMENTS, foreignKey: `ArticleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `ArticleId`});

  Article.belongsToMany(Category, {through: ArticleCategory, as: CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: ARTICLES});
  Category.hasMany(ArticleCategory, {as: ARTICLE_CATEGORIES});
  Article.hasMany(ArticleCategory, {as: ARTICLE_CATEGORIES});

  User.hasMany(Comment, {as: COMMENTS, foreignKey: `UserId`, onDelete: `cascade`});
  Comment.belongsTo(User, {as: USERS, foreignKey: `UserId`});

  User.hasMany(Article, {as: ARTICLES, foreignKey: `UserId`, onDelete: `cascade`});
  Article.belongsTo(User, {as: USERS, foreignKey: `UserId`});

  return {Category, Comment, User, Article, ArticleCategory};
};

module.exports = define;
