'use strict';

const {POPULARS_COUNT} = require(`../../constants`);
const truncate = require(`../lib/truncate`);
const {Aliase: {ARTICLE}} = require(`../models/common`);
const UserRelatedService = require(`./user-related`);

class CommentsService extends UserRelatedService {
  constructor({models}) {
    super({models});

    this.entityName = `comment`;
    this.parentEntityName = `article`;
    this._Comment = models.Comment;
    this._Article = models.Article;
  }

  async create(ArticleId, comment) {
    return await this._Comment.create({
      ArticleId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return Boolean(deletedRows);
  }

  async findAll({articleId = null, limit = null} = {}) {
    const options = {
      include: [this._userInclusion],
      order: [[`createdAt`, `desc`]]
    };

    if (articleId) {
      options.where = {ArticleId: articleId};
    }

    if (limit) {
      options.limit = limit;
    } else {
      options.include.push({
        model: this._Article,
        as: ARTICLE,
        attributes: [`title`]
      });
    }

    return await this._Comment.findAll(options);
  }

  async findOne({id}) {
    return await this._Comment.findByPk(id);
  }

  async findPopular() {
    const comments = await this.findAll({limit: POPULARS_COUNT});
    return comments.map((item) => {
      const comment = item.get();
      comment.truncatedText = truncate(comment.text);
      return comment;
    });
  }
}

module.exports = CommentsService;
