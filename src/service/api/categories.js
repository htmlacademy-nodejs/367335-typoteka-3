'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

module.exports = (app, categoriesService) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, (req, res) => {
    return res.status(StatusCodes.OK).json(categoriesService.findAll());
  });
};
