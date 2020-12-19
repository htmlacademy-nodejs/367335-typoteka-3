'use strict';

const {nanoid} = require(`nanoid`);
const dayjs = require(`dayjs`);
const {writeFile} = require(`fs`).promises;

const {ExitCode, MOCK_FILE_NAME} = require(`../../constants`);
const {getRandomInt, shuffle, outputRes, writeFileToArray} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const DEFAULT_ID_LENGTH = 6;
const DELIMS = [` `, `\n`];
const DEFAULT_DATE_ENTITY = `days`;
const DEFAULT_DATE_SUBTRACT_MAX = 90;
const DEFAULT_DATE_FORMAT = `YYYY-MM-DD HH:mm:ss`;

const DataFilePath = {
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
  PEOPLES: `./data/peoples.txt`,
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`
};

const ArticlesRestrict = {
  MIN: 1,
  MAX: 1000
};

const AnnouncesRestrict = {
  MIN: 1,
  MAX: 5
};

const getRandomIndex = (someArray) => getRandomInt(0, someArray.length - 1);

const getRandomItem = (someArray) => someArray[getRandomIndex(someArray)];

const getRandomRestrict = (list, MIN = 0) => ({
  MIN,
  MAX: getRandomIndex(list) || DEFAULT_COUNT
});

const getRandomStrFromItems = ({
  list = [],
  Restrict = {MIN: 0, MAX: 0},
  joiner = DELIMS[0],
  limit = 0
}) => {
  const str = shuffle(list.slice()).slice(Restrict.MIN, Restrict.MAX).join(joiner);
  return limit ? str.slice(0, limit) : str;
};

const getRandomDate = (dateFormat = DEFAULT_DATE_FORMAT, dateEntity = DEFAULT_DATE_ENTITY, dateSubstractMax = DEFAULT_DATE_SUBTRACT_MAX
) => {
  const subtractNumber = getRandomInt(0, dateSubstractMax);
  return dayjs().subtract(subtractNumber, dateEntity).format(dateFormat);
};

const getId = (length = DEFAULT_ID_LENGTH) => nanoid(length);

const getAnnounce = (sentences, limit = 0) => getRandomStrFromItems({
  list: sentences,
  Restrict: AnnouncesRestrict,
  limit
});

const getFullText = (sentences, limit = 0) => getRandomStrFromItems({
  list: sentences,
  Restrict: getRandomRestrict(sentences),
  joiner: getRandomItem(DELIMS),
  limit
});

const getCategory = (categories) => getRandomStrFromItems({
  list: categories,
  Restrict: getRandomRestrict(categories),
  joiner: DELIMS[1]
});

const getCommentText = (comments, {MIN = DEFAULT_COUNT}, limit = 0) => {
  return getRandomStrFromItems({
    list: comments,
    Restrict: {
      MIN,
      MAX: comments.length - 1
    },
    limit
  });
};

const writeArticlesMockFile = async (countStr, generate, mockFileName = MOCK_FILE_NAME) => {
  const {MIN, MAX} = ArticlesRestrict;
  const articlesCount = Math.max(Number.parseInt(countStr, 10) || MIN, MIN);

  if (articlesCount > MAX) {
    outputRes(`No more than ${MAX} articles`, `ERROR`);
    process.exit(ExitCode.ERROR);
  }

  const [categories, comments, sentences, titles, peoples] = await Promise.all([
    writeFileToArray(DataFilePath.CATEGORIES),
    writeFileToArray(DataFilePath.COMMENTS),
    writeFileToArray(DataFilePath.SENTENCES),
    writeFileToArray(DataFilePath.TITLES),
    writeFileToArray(DataFilePath.PEOPLES)
  ]);
  const content = generate({articlesCount, peoples, categories, comments, sentences, titles});

  try {
    await writeFile(mockFileName, content);
    outputRes(`Operation success. File ${mockFileName} created. Articles - ${articlesCount}`, `SUCCESS`);
  } catch (err) {
    console.log(err);
    outputRes(`Can't write data to file...`, `ERROR`);
  }
};

module.exports = {
  getAnnounce,
  getCategory,
  getCommentText,
  getId,
  getRandomDate,
  getRandomIndex,
  getRandomItem,
  getFullText,
  writeArticlesMockFile
};
