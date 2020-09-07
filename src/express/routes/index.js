'use strict';

const {Router} = require(`express`);
const indexRouter = new Router();

const template = `
  /
  <br><br>
  <a href="/articles/category/1">/articles/category/:id</a><br>
  <a href="/articles/edit/1">/articles/edit/:id</a><br>
  <a href="/articles/add">/articles/add</a><br>
  <a href="/articles/1">/articles/:id</a><br>
  <a href="/my">/my</a><br>
  <a href="/my/comments">/my/comments</a><br>
  <a href="/categories">/categories</a><br>
  <a href="/login">/login</a><br>
  <a href="/register">/register</a><br>
  <a href="/search">/search</a><br>
`;

indexRouter.get(`/categories`, (req, res) => {
  res.send(`/categories`);
});
indexRouter.get(`/search`, (req, res) => {
  res.send(`/search`);
});
indexRouter.get(`/login`, (req, res) => {
  res.send(`/login`);
});
indexRouter.get(`/register`, (req, res) => {
  res.send(`/register`);
});
indexRouter.get(`/`, (req, res) => {
  res.send(template);
});

module.exports = indexRouter;
