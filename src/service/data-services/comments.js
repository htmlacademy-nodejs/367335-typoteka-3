'use strict';

const UserRelatedService = require(`./user-related`);

class CommentsService extends UserRelatedService {
  constructor({models}) {
    super({models});

    this.entityName = `comment`;
    this.parentEntityName = `article`;
    this._Article = models.Article;
    this._Comment = models.Comment;
  }

  findAll(ArticleId) {
    return this._Comment.findAll({
      where: {ArticleId},
      order: [[`createdAt`, `desc`]],
      include: [this._userInclusion],
      raw: true
    });
  }

  findOne({id}) {
    return this._Comment.findByPk(id);
  }

  create(ArticleId, comment) {
    return this._Comment.create({
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
}

module.exports = CommentsService;
