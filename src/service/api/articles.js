'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);
const itemExistsChecker = require(`../middlewares/item-exists-checker`);
const schemaValidator = require(`../middlewares/schema-validator`);
const schema = require(`../schema`);

module.exports = (app, articlesService, commentsService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {isPopular = false, offset = 0, limit = 0, comments = 0, CategoryId = null} = req.query;

    let articles;
    if (isPopular) {
      articles = await articlesService.findPopular();
    } else if (limit || offset) {
      articles = await articlesService.findPage({offset, limit, comments, CategoryId});
    } else {
      articles = await articlesService.findAll(comments);
    }

    res.status(StatusCodes.OK).json(articles);
  });

  route.post(`/`, schemaValidator(schema.article), async (req, res) => {
    const article = await articlesService.create(req.body);
    res.status(StatusCodes.CREATED).json(article);
  });

  route.get(`/:articleId`, [
    schemaValidator(schema.articleRouteParams, true),
    itemExistsChecker(articlesService)
  ], (req, res) => {
    res.status(StatusCodes.OK).json(res.locals.article);
  });

  route.put(`/:articleId`, [
    schemaValidator(schema.articleRouteParams, true),
    itemExistsChecker(articlesService),
    schemaValidator(schema.article)
  ], async (req, res) => {
    const updatedArticle = await articlesService.update(req.params.articleId, req.body);
    res.status(StatusCodes.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, [
    schemaValidator(schema.articleRouteParams, true),
    itemExistsChecker(articlesService)
  ], async (req, res) => {
    const deletedArticle = await articlesService.drop(req.params.articleId);
    res.status(StatusCodes.OK).json(deletedArticle);
  });

  route.get(`/:articleId/comments`, [
    schemaValidator(schema.articleRouteParams, true),
    itemExistsChecker(articlesService)
  ], async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentsService.findAll({articleId});
    res.status(StatusCodes.OK).json(comments);
  });

  route.post(`/:articleId/comments`, [
    schemaValidator(schema.articleRouteParams, true),
    itemExistsChecker(articlesService),
    schemaValidator(schema.comment)
  ], async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentsService.create(articleId, req.body);
    res.status(StatusCodes.CREATED).json(comment);
  });

  route.delete(`/:articleId/comments/:commentId`, [
    schemaValidator(schema.articleRouteParams, true),
    itemExistsChecker(articlesService),
    itemExistsChecker(commentsService)
  ], async (req, res) => {
    const {commentId} = req.params;
    const deleted = await commentsService.drop(commentId);
    res.status(StatusCodes.OK).json(deleted);
  });
};
