'use strict';

const express = require(`express`);
const {DEFAULT_PORT} = require(`../constants`);
const articlesRouter = require(`./routes/articles`);
const myRouter = require(`./routes/my`);
const indexRouter = require(`./routes/index`);

const app = express();

app.use(`/articles`, articlesRouter);
app.use(`/my`, myRouter);
app.use(`/`, indexRouter);

app.listen(DEFAULT_PORT);
