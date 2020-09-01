'use strict';

const {ExitCode} = require(`../../constants`);
const {getRandomInt, getRandomIndex, getRandomItem, outputRes, readContent, shuffle} = require(`../../utils`);
const {writeFile} = require(`fs`).promises;
const moment = require(`moment`);

const PostsRestrict = {
  MIN: 1,
  MAX: 1000
};

const AnnounceRestrinct = {
  MIN: 1,
  MAX: 5
};

const FILE_NAME = `mocks.json`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const DATE_SUBTRACT_ENTITY = `days`;
const DATE_SUBTRACT_MAX = 90;
const DATE_FORMAT = `YYYY-MM-DD HH:mm:ss`;
const SENTENCE_DELIMS = [` `, `\n`];

const generatePosts = ({count, categories, sentences, titles}) => (Array(count).fill({}).map(() => ({
  title: getRandomItem(titles),
  announce: shuffle(sentences).slice(0, getRandomInt(AnnounceRestrinct.MIN + 1, AnnounceRestrinct.MAX)).join(SENTENCE_DELIMS[0]),
  fullText: shuffle(sentences).slice(0, getRandomIndex(sentences)).join(getRandomItem(SENTENCE_DELIMS)),
  createdDate: moment().subtract(getRandomInt(0, DATE_SUBTRACT_MAX), DATE_SUBTRACT_ENTITY).format(DATE_FORMAT),
  category: shuffle(categories).slice(0, getRandomIndex(categories) || 1)
})));

module.exports = {
  name: `--generate`,
  async run([countStr]) {
    const count = +countStr || PostsRestrict.MIN;

    if (count > PostsRestrict.MAX) {
      outputRes(`Не больше ${PostsRestrict.MAX} публикаций`, `ERROR`);
      process.exit(ExitCode.ERROR);
    }

    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const content = generatePosts({count, categories, sentences, titles});

    try {
      await writeFile(FILE_NAME, JSON.stringify(content));
      outputRes(`Операция прошла успешно. Файл создан, записей - ${count}.`, `SUCCESS`);
    } catch (err) {
      outputRes(`Ошибка записи данных в файл...`, `ERROR`);
    }
  }
};
