'use strict';

const {ExitCode, FIRST_ID, MaxValue} = require(`../../constants`);
const {getRandomInt} = require(`../../utils`);
const {
  getDataFromDataFiles,
  getAnnounce,
  getCategories,
  getCommentText,
  getFullText,
  getRandomDate,
  getRandomIndex,
  getRandomItem,
  generateData,
  generatePicture
} = require(`../lib/mock-utils`);

const sequelize = require(`../lib/sequelize`);
const initDB = require(`../lib/init-db`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `filldb`});

const exitWithError = (err) => {
  logger.error(err.message ? `An error occured: ${err.message}` : err);
  process.exit(ExitCode.ERROR);
};

const generatePosts = ({articlesCount, users, categories, comments, sentences, titles}) => {
  return Array(articlesCount).fill({}).map(() => ({
    title: getRandomItem(titles),
    announce: getAnnounce(sentences, MaxValue.ANNOUNCE),
    fullText: getFullText(sentences, MaxValue.TEXT),
    picture: generatePicture(),
    pubDate: getRandomDate(),
    categories: getCategories(categories),
    Comments: Array(getRandomIndex(comments)).fill({}).map(() => ({
      text: getCommentText(comments, {}, MaxValue.COMMENT),
      UserId: getRandomInt(FIRST_ID, users.length)
    })),
    UserId: getRandomInt(FIRST_ID, users.length)
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
      users
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
          users
        }),
        users
      }));
    } catch (err) {
      exitWithError(err);
    }

    logger.info(`Operation success. DB created and filled.`);
  }
};
