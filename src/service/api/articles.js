'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);
const itemExistsChecker = require(`../middlewares/item-exists-checker`);
const itemValidator = require(`../middlewares/item-validator`);
const keysToCheckArticle = [`title`, `announce`, `fullText`, `pubDate`, `categories`];

module.exports = (app, articlesService, commentsService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset = 0, limit = 0, comments = 0} = req.query;

    let articles;
    if (limit || offset) {
      articles = await articlesService.findPage({offset, limit, comments});
    } else {
      articles = await articlesService.findAll(comments);
    }

    res.status(StatusCodes.OK).json(articles);
  });

  route.post(`/`, itemValidator(keysToCheckArticle), async (req, res) => {
    const article = await articlesService.create(req.body);
    res.status(StatusCodes.CREATED).json(article);
  });

  route.get(`/:articleId`, itemExistsChecker(articlesService), (req, res) => {
    res.status(StatusCodes.OK).json(res.locals.article);
  });

  route.put(`/:articleId`, [
    itemExistsChecker(articlesService),
    itemValidator(keysToCheckArticle)
  ], async (req, res) => {
    const updatedArticle = await articlesService.update(req.params.articleId, req.body);
    res.status(StatusCodes.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, itemExistsChecker(articlesService), async (req, res) => {
    const deletedArticle = await articlesService.drop(req.params.articleId);
    res.status(StatusCodes.OK).json(deletedArticle);
  });

  route.get(`/:articleId/comments`, itemExistsChecker(articlesService), async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentsService.findAll(articleId);
    res.status(StatusCodes.OK).json(comments);
  });

  route.post(`/:articleId/comments`, [
    itemExistsChecker(articlesService),
    itemValidator([`text`])
  ], async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentsService.create(articleId, req.body);
    res.status(StatusCodes.CREATED).json(comment);
  });

  route.delete(`/:articleId/comments/:commentId`, [
    itemExistsChecker(articlesService),
    itemExistsChecker(commentsService)
  ], async (req, res) => {
    const {commentId} = req.params;
    const deleted = await commentsService.drop(commentId);
    res.status(StatusCodes.OK).json(deleted);
  });
};
