'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

mainRouter.get(`/categories`, (req, res) => {
  res.render(`all-categories`);
});
mainRouter.get(`/search`, (req, res) => {
  res.render(`search`);
});
mainRouter.get(`/login`, (req, res) => {
  res.render(`login`);
});
mainRouter.get(`/register`, (req, res) => {
  res.render(`sign-up`);
});
mainRouter.get(`/`, (req, res) => {
  res.render(`main`);
});

module.exports = mainRouter;
