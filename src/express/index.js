'use strict';

const express = require(`express`);
const path = require(`path`);
const {StatusCodes} = require(`http-status-codes`);
const {DEFAULT_PORT, PUBLIC_DIR} = require(`../constants`);
const articlesRouter = require(`./routes/articles`);
const myRouter = require(`./routes/my`);
const mainRouter = require(`./routes/main`);

const UPLOAD_DIR = `upload`;
const app = express();

app.use(`/articles`, articlesRouter);
app.use(`/my`, myRouter);
app.use(`/`, mainRouter);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use((req, res) => res.status(StatusCodes.BAD_REQUEST).render(`400`));
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).render(`500`);
});

app.set(`views`, path.resolve(__dirname, `templates/entries`));
app.set(`view engine`, `pug`);

app.listen(process.env.PORT || DEFAULT_PORT);
