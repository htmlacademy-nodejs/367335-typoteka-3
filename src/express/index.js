'use strict';

const express = require(`express`);
const session = require(`express-session`);
const cookieParser = require(`cookie-parser`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);
const path = require(`path`);
const {StatusCodes} = require(`http-status-codes`);
const {MinValue, MaxValue} = require(`../constants`);
const sequelize = require(`../service/lib/sequelize`);
const articlesRouter = require(`./routes/articles`);
const myRouter = require(`./routes/my`);
const mainRouter = require(`./routes/main`);

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const app = express();

const sessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});
sequelize.sync({force: false});

// Для использования в шаблонизаторе
app.locals.MinValue = MinValue;
app.locals.MaxValue = MaxValue;

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
  store: sessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false
}));

app.use(`/articles`, articlesRouter);
app.use(`/my`, myRouter);
app.use(`/`, mainRouter);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use((req, res) => {
  res.status(StatusCodes.BAD_REQUEST).render(`400`);
});
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).render(`500`);
});

app.set(`views`, path.resolve(__dirname, `templates/entries`));
app.set(`view engine`, `pug`);

app.listen(process.env.PORT || DEFAULT_PORT);
