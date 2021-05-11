'use strict';

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const definePeople = require(`./people`);
const Aliase = require(`./aliase`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const People = definePeople(sequelize);
  const ArticleCategory = sequelize.define(`ArticleCategory`, {}, {sequelize});

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  Article.belongsToMany(Category, {through: ArticleCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Aliase.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Aliase.ARTICLE_CATEGORIES});

  People.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `peopleId`});
  Comment.belongsTo(People, {foreignKey: `peopleId`});

  People.hasMany(Article, {as: Aliase.ARTICLES, foreignKey: `peopleId`});
  Article.belongsTo(People, {foreignKey: `peopleId`});

  return {Category, Comment, People, Article, ArticleCategory};
};

module.exports = define;
