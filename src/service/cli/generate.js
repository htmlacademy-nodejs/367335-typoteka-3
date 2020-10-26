'use strict';

const {FILE_NAME, GENERATED_ID_LENGTH, ExitCode} = require(`../../constants`);
const {getRandomInt, getRandomIndex, getRandomItem, getRandomStrFromItems, outputRes, readContent} = require(`../../utils`);
const {writeFile} = require(`fs`).promises;
const moment = require(`moment`);
const {nanoid} = require(`nanoid`);

const DEFAULT_COUNT = 1;
const PostsRestrict = {
  MIN: 1,
  MAX: 1000
};
const AnnounceRestrict = {
  MIN: 1,
  MAX: 5
};
const DataFilePath = {
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`
};
const DATE_SUBTRACT_ENTITY = `days`;
const DATE_SUBTRACT_MAX = 90;
const DATE_FORMAT = `YYYY-MM-DD HH:mm:ss`;
const DELIMS = [` `, `\n`];

const getRandomRestrict = (list, MIN = 0) => ({MIN, MAX: getRandomIndex(list) || DEFAULT_COUNT});
const generateComments = (comments, count = getRandomIndex(comments)) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(GENERATED_ID_LENGTH),
    text: getRandomStrFromItems({
      list: comments,
      Restrict: {MIN: DEFAULT_COUNT, MAX: comments.length - 1}
    })
  }));
};

const generatePosts = ({count, categories, comments, sentences, titles}) => (Array(count).fill({}).map(() => ({
  id: nanoid(GENERATED_ID_LENGTH),
  title: getRandomItem(titles),
  announce: getRandomStrFromItems({
    list: sentences,
    Restrict: AnnounceRestrict
  }),
  fullText: getRandomStrFromItems({
    list: sentences,
    Restrict: getRandomRestrict(sentences),
    joiner: getRandomItem(DELIMS)
  }),
  createdDate: moment().subtract(getRandomInt(0, DATE_SUBTRACT_MAX), DATE_SUBTRACT_ENTITY).format(DATE_FORMAT),
  category: getRandomStrFromItems({
    list: categories,
    Restrict: getRandomRestrict(categories),
    joiner: DELIMS[1]
  }),
  comments: generateComments(comments)
})));

module.exports = {
  name: `--generate`,
  async run([countStr]) {
    const count = +countStr || PostsRestrict.MIN;

    if (count > PostsRestrict.MAX) {
      outputRes(`Не больше ${PostsRestrict.MAX} публикаций`, `ERROR`);
      process.exit(ExitCode.ERROR);
    }

    const categories = await readContent(DataFilePath.CATEGORIES);
    const sentences = await readContent(DataFilePath.SENTENCES);
    const titles = await readContent(DataFilePath.TITLES);
    const comments = await readContent(DataFilePath.COMMENTS);
    const content = generatePosts({count, categories, comments, sentences, titles});

    try {
      await writeFile(FILE_NAME, JSON.stringify(content));
      outputRes(`Операция прошла успешно. Файл создан, записей - ${count}.`, `SUCCESS`);
    } catch (err) {
      outputRes(`Ошибка записи данных в файл...`, `ERROR`);
    }
  }
};
