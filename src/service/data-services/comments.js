'use strict';

class CommentsService {
  constructor({models}) {
    this.entityName = `comment`;
    this.parentEntityName = `article`;
    this._Article = models.Article;
    this._Comment = models.Comment;
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  findOne(commentId) {
    return this._Comment.findByPk(commentId);
  }

  create(articleId, comment) {
    return this._Comment.create({
      articleId,
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
