'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

module.exports = (app, categoriesService) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await categoriesService.findAll(count);
    return res.status(StatusCodes.OK).json(categories);
  });
};
