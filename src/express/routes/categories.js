'use strict';

const {Services: {CATEGORIES}} = require(`../../constants`);
const {Router} = require(`express`);
const categoriesRouter = new Router();

categoriesRouter.get(`/`, (req, res) => {
  res.send(`/${CATEGORIES.alias}`);
});

module.exports = categoriesRouter;
