'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

const route = new Router();

module.exports = (app, searchService) => {
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query = ``} = req.query;
    if (!query) {
      return res.status(StatusCodes.BAD_REQUEST).json([]);
    }

    const searchResults = searchService.findAll(query);
    const searchStatus = StatusCodes[searchResults.length ? `OK` : `NOT_FOUND`];

    return res.status(searchStatus).json(searchResults);
  });
};
