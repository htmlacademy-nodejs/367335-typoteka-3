'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

module.exports = (app, commentsService) => {
  const route = new Router();
  app.use(`/comments`, route);

  route.get(`/`, async (req, res) => {
    const {isPopular = false, limit = null} = req.query;
    let comments = {};
    if (isPopular) {
      comments = await commentsService.findPopular();
    } else {
      comments = await commentsService.findAll({limit});
    }

    return res.status(StatusCodes.OK).json(comments);
  });
};
