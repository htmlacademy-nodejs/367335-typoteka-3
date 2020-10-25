'use strict';

const {nanoid} = require(`nanoid`);
const {GENERATED_ID_LENGTH} = require(`../../constants`);

class CommentsService {
  constructor() {
    this.entityName = `comment`;
    this.parentEntityName = `article`;
  }

  findAll(article) {
    return article.comments;
  }

  findOne(article, commentId) {
    return article.comments.find((item) => item.id === commentId);
  }

  create(article, comment) {
    const newComment = {
      id: nanoid(GENERATED_ID_LENGTH),
      ...comment
    };
    article.comments.push(newComment);
    return newComment;
  }

  drop(article, commentId) {
    const dropComment = this.findOne(article, commentId);
    article.comments = article.comments.filter((item) => item.id !== commentId);
    return dropComment;
  }
}

module.exports = CommentsService;
