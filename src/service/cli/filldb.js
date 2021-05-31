'use strict';

const {ExitCode, FIRST_ID} = require(`../../constants`);
const {getRandomInt} = require(`../../utils`);
const {
  getDataFromDataFiles,
  getAnnounce,
  getCategory,
  getCommentText,
  getFullText,
  getRandomDate,
  getRandomIndex,
  getRandomItem
} = require(`../lib/mock-utils`);

const sequelize = require(`../lib/sequelize`);
const initDB = require(`../lib/init-db`);
const generateData = require(`../lib/generate-data`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `filldb`});

const exitWithError = (err) => {
  logger.error(err.message ? `An error occured: ${err.message}` : err);
  process.exit(ExitCode.ERROR);
};

const generatePosts = ({articlesCount, peoples, categories, comments, sentences, titles}) => {
  return Array(articlesCount).fill({}).map(() => ({
    title: getRandomItem(titles),
    announce: getAnnounce(sentences),
    fullText: getFullText(sentences),
    pubDate: getRandomDate(),
    category: getCategory(categories),
    comments: Array(getRandomIndex(comments)).fill({}).map(() => ({
      text: getCommentText(comments, {}),
      peopleId: getRandomInt(FIRST_ID, peoples.length)
    })),
    peopleId: getRandomInt(FIRST_ID, peoples.length)
  }));
};

module.exports = {
  name: `--filldb`,
  generateData,
  async run([countStr]) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      exitWithError(err);
    }
    logger.info(`Connection to database established`);

    const {
      articlesCount,
      categories,
      comments,
      sentences,
      titles,
      peoples
    } = await getDataFromDataFiles(countStr);

    try {
      await initDB(sequelize, generateData({
        categories,
        articles: generatePosts({
          articlesCount,
          categories,
          comments,
          sentences,
          titles,
          peoples
        }),
        peoples
      }));
    } catch (err) {
      exitWithError(err);
    }

    logger.info(`Operation success. DB created and filled.`);
  }
};
