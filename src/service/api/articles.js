'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);
const itemExistsChecker = require(`../middlewares/item-exists-checker`);
const itemValidator = require(`../middlewares/item-validator`);
const keysToCheckArticle = [`title`, `announce`, `fullText`, `createdDate`, `category`];

module.exports = (app, articlesService, commentsService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articlesService.findAll();
    res.status(StatusCodes.OK).json(articles);
  });

  route.get(`/:articleId`, itemExistsChecker(articlesService), (req, res) => {
    res.status(StatusCodes.OK).json(res.locals.article);
  });

  route.post(`/`, itemValidator(keysToCheckArticle), (req, res) => {
    const article = articlesService.create(req.body);
    res.status(StatusCodes.CREATED).json(article);
  });

  route.put(`/:articleId`, [
    itemExistsChecker(articlesService),
    itemValidator(keysToCheckArticle)
  ], (req, res) => {
    const updatedArticle = articlesService.update(req.params.articleId, req.body);
    res.status(StatusCodes.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, itemExistsChecker(articlesService), (req, res) => {
    const deletedArticle = articlesService.drop(req.params.articleId);
    res.status(StatusCodes.OK).json(deletedArticle);
  });

  route.get(`/:articleId/comments`, itemExistsChecker(articlesService), (req, res) => {
    const comments = commentsService.findAll(res.locals.article);
    res.status(StatusCodes.OK).json(comments);
  });

  route.post(`/:articleId/comments`, [
    itemExistsChecker(articlesService),
    itemValidator([`text`])
  ], (req, res) => {
    const comment = commentsService.create(res.locals.article, req.body);
    res.status(StatusCodes.CREATED).json(comment);
  });

  route.delete(`/:articleId/comments/:commentId`, [
    itemExistsChecker(articlesService),
    itemExistsChecker(commentsService)
  ], (req, res) => {
    const deletedComment = commentsService.drop(res.locals.article, req.params.commentId);
    res.status(StatusCodes.OK).json(deletedComment);
  });
};
