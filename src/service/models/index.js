'use strict';

const definePeople = require(`./people`);
const defineArticle = require(`./article`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticleCategory = require(`./article-category`);
const {Aliase: {ARTICLES, CATEGORIES, COMMENTS, ARTICLE_CATEGORIES}} = require(`./common`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const People = definePeople(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);

  Article.hasMany(Comment, {as: COMMENTS, foreignKey: `ArticleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `ArticleId`});

  Article.belongsToMany(Category, {through: ArticleCategory, as: CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: ARTICLES});
  Category.hasMany(ArticleCategory, {as: ARTICLE_CATEGORIES});

  People.hasMany(Comment, {as: COMMENTS, foreignKey: `PersonId`, onDelete: `cascade`});
  Comment.belongsTo(People, {foreignKey: `PersonId`});

  People.hasMany(Article, {as: ARTICLES, foreignKey: `PersonId`, onDelete: `cascade`});
  Article.belongsTo(People, {foreignKey: `PersonId`});

  return {Category, Comment, People, Article, ArticleCategory};
};

module.exports = define;
