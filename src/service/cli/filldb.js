'use strict';

const {ExitCode, TextLength, FIRST_ID} = require(`../../constants`);
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

const generatePosts = ({articlesCount, people, categories, comments, sentences, titles}) => {
  return Array(articlesCount).fill({}).map(() => ({
    title: getRandomItem(titles),
    announce: getAnnounce(sentences, TextLength.SHORT),
    fullText: getFullText(sentences, TextLength.LONG),
    picture: generatePicture(),
    pubDate: getRandomDate(),
    categories: getCategories(categories),
    Comments: Array(getRandomIndex(comments)).fill({}).map(() => ({
      text: getCommentText(comments, {}, TextLength.SHORT),
      PersonId: getRandomInt(FIRST_ID, people.length)
    })),
    PersonId: getRandomInt(FIRST_ID, people.length)
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
      people
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
          people
        }),
        people
      }));
    } catch (err) {
      exitWithError(err);
    }

    logger.info(`Operation success. DB created and filled.`);
  }
};
