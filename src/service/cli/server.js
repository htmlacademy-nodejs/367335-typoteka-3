'use strict';

const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);
const {DEFAULT_API_PORT, ExitCode} = require(`../../constants`);
const express = require(`express`);
const http = require(`http`);
const routes = require(`../api/main`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const socket = require(`../lib/socket`);

const logger = getLogger({name: `api`});
const app = express();

const server = http.createServer(app);
const io = socket(server);
app.locals.socketio = io;

app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => logger.info(`Response status code ${res.statusCode}`));
  next();
});

app.use(`/api`, routes);

app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occured on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  async run([customPort]) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }

    logger.info(`Connection to database established`);

    const port = Number.parseInt(customPort, 10) || DEFAULT_API_PORT;

    try {
      server.listen(port, (err) => {
        if (err) {
          return logger.error(`Error in creating server: ${err.message}`);
        }
        return logger.info(`Waiting for connections on ${port}`);
      });
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
  }
};
