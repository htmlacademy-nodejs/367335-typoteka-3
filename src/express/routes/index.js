'use strict';

const {Router} = require(`express`);
const indexRouter = new Router();

indexRouter.get(`/categories`, (req, res) => {
  res.render(`all-categories`);
});
indexRouter.get(`/search`, (req, res) => {
  res.render(`search`);
});
indexRouter.get(`/login`, (req, res) => {
  res.render(`login`);
});
indexRouter.get(`/register`, (req, res) => {
  res.render(`sign-up`);
});
indexRouter.get(`/`, (req, res) => {
  res.render(`main`);
});

module.exports = indexRouter;
