'use strict';

const {POPULARS_COUNT} = require(`../../constants`);
const truncate = require(`../lib/truncate`);
const {Aliase: {CATEGORIES, COMMENTS, ARTICLE_CATEGORIES}} = require(`../models/common`);
const UserRelatedService = require(`./user-related`);

class ArticlesService extends UserRelatedService {
  constructor(sequelize) {
    super(sequelize);

    const {models} = sequelize;
    this._Article = models.Article;
    this._Comment = models.Comment;
    this._Category = models.Category;
    this._ArticleCategory = models.ArticleCategory;

    this._sequelize = sequelize;
    this.entityName = `article`;

    this._commentInclusion = {
      model: this._Comment,
      as: COMMENTS,
      include: [this._userInclusion]
    };
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.Categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(comments = 0) {
    const articles = await this._Article.findAll({
      include: this._getInclude(comments),
      order: [[`pubDate`, `desc`]]
    });
    return articles.map((item) => item.get());
  }

  async findOne({id, comments = 0}) {
    const options = {
      subQuery: false,
      include: this._getInclude(comments, true),
      group: [
        this._sequelize.col(`Article.id`),
        this._sequelize.col(`Categories.id`),
        this._sequelize.col(`Categories->ArticleCategory.createdAt`),
        this._sequelize.col(`Categories->ArticleCategory.updatedAt`),
        this._sequelize.col(`Categories->ArticleCategory.ArticleId`),
        this._sequelize.col(`Categories->ArticleCategory.CategoryId`),
        this._sequelize.col(`Users.id`)
      ],
      order: [[{model: this._Category, as: CATEGORIES}, `title`, `asc`]]
    };

    if (comments) {
      options.group.push(this._sequelize.col(`Comments.id`), this._sequelize.col(`Comments->Users.id`));
      options.order.push([{model: this._Comment, as: COMMENTS}, `createdAt`, `desc`]);
    }

    const article = await this._Article.findByPk(id, options);
    if (article) {
      return article.get({plain: true});
    }
    return article;
  }

  async findPage({limit = 0, offset = 0, comments = 0, CategoryId = null}) {
    const options = {
      limit,
      offset,
      include: this._getInclude(comments),
      distinct: true,
      order: [
        [`pubDate`, `desc`],
        [{model: this._Category, as: CATEGORIES}, `title`, `asc`]
      ]
    };
    if (CategoryId) {
      options.include.push({
        model: this._ArticleCategory,
        as: ARTICLE_CATEGORIES,
        attributes: [],
        where: {
          CategoryId
        }
      });
    }

    const {count, rows} = await this._Article.findAndCountAll(options);
    return {count, articles: rows};
  }

  async findPopular() {
    const options = {
      subQuery: false,
      attributes: {
        include: [
          [this._sequelize.fn(`COUNT`, this._sequelize.col(`Comments.id`)), `commentsCount`]
        ]
      },
      include: [{
        model: this._Comment,
        as: COMMENTS,
        attributes: []
      }],
      group: [
        this._sequelize.col(`Article.id`)
      ],
      order: [
        [this._sequelize.fn(`COUNT`, this._sequelize.col(`Comments.id`)), `desc`]
      ],
      limit: POPULARS_COUNT
    };

    const articles = await this._Article.findAll(options);

    return articles
      .map((item) => {
        const article = item.get();
        article.truncatedText = truncate(article.announce);
        return article;
      })
      .filter((item) => item.commentsCount);
  }

  async update(id, articleData) {
    const [affectedRows] = await this._Article.update(articleData, {
      where: {id}
    });

    const article = await this._Article.findByPk(id);
    await article.setCategories(articleData.Categories);

    return Boolean(affectedRows);
  }

  _getInclude(comments, countCategories = false) {
    const include = [
      {
        model: this._Category,
        as: CATEGORIES,
        attributes: [
          `id`,
          `title`
        ]
      },
      this._userInclusion
    ];

    if (countCategories) {
      include[0].attributes.push([
        this._sequelize.fn(`COUNT`, this._sequelize.col(`Article.id`)),
        `count`
      ]);
      include[0].include = [{
        model: this._ArticleCategory,
        as: ARTICLE_CATEGORIES,
        attributes: []
      }];
    }

    if (Number(comments)) {
      include.push(this._commentInclusion);
    }

    return include;
  }
}

module.exports = ArticlesService;
