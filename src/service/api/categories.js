'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

const route = new Router();

module.exports = (app, categoriesService) => {
  app.use(`/categories`, route);

  route.get(`/`, (req, res) => {
    return res.status(StatusCodes.OK).json(categoriesService.findAll());
  });
};
