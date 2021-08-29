'use strict';

const {nanoid} = require(`nanoid`);
const dayjs = require(`dayjs`);
const {hashSync} = require(`../lib/password`);

const {ExitCode} = require(`../../constants`);
const {getRandomInt, shuffle, outputRes, writeFileToArray} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const DEFAULT_ID_LENGTH = 6;
const DELIMS = [` `, `\n`];
const DEFAULT_DATE_ENTITY = `days`;
const DEFAULT_DATE_SUBTRACT_MAX = 90;
const DEFAULT_DATE_FORMAT = `YYYY-MM-DD HH:mm:ss`;
const SALT_ROUNDS = 10;
const EMAIL_DOMAINS = [`ru`, `com`, `net`, `academy`];
const IMG_EXTENSIONS = [`jpg`, `png`];
const EmailRestrict = {
  MIN: 4,
  MAX: 12
};
const PasswordRestrict = {
  MIN: 6,
  MAX: 12
};
const PictureRestrict = {
  MIN: 3,
  MAX: 16
};
const ArticlesRestrict = {
  MIN: 1,
  MAX: 1000
};
const AnnouncesRestrict = {
  MIN: 1,
  MAX: 5
};
const DataFilePath = {
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
  USERS: `./data/users.txt`,
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`
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

const getCategories = (categories) => shuffle(categories.slice()).slice(0, getRandomIndex(categories));

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

const getDataFromDataFiles = async (countStr) => {
  const {MIN, MAX} = ArticlesRestrict;
  const articlesCount = Math.max(Number.parseInt(countStr, 10) || MIN, MIN);

  if (articlesCount > MAX) {
    outputRes(`No more than ${MAX} articles`, `ERROR`);
    process.exit(ExitCode.ERROR);
  }

  const [categories, comments, sentences, titles, users] = await Promise.all([
    writeFileToArray(DataFilePath.CATEGORIES),
    writeFileToArray(DataFilePath.COMMENTS),
    writeFileToArray(DataFilePath.SENTENCES),
    writeFileToArray(DataFilePath.TITLES),
    writeFileToArray(DataFilePath.USERS)
  ]);

  return {articlesCount, users, categories, comments, sentences, titles};
};

const generatePicture = () => {
  const imgLength = getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX);
  return `${getId(imgLength).toLowerCase()}.${getRandomItem(IMG_EXTENSIONS)}`;
};

const generateUser = (user) => {
  const emailPrependLength = getRandomInt(EmailRestrict.MIN, EmailRestrict.MAX);
  const emailAppendLength = getRandomInt(EmailRestrict.MIN, EmailRestrict.MAX);
  const passwordLength = getRandomInt(PasswordRestrict.MIN, PasswordRestrict.MAX);
  const [firstName, lastName] = user.split(` `);

  return {
    firstName,
    lastName,
    email: `${nanoid(emailPrependLength)}@${nanoid(emailAppendLength)}.${getRandomItem(EMAIL_DOMAINS)}`,
    passwordHash: hashSync(nanoid(passwordLength), SALT_ROUNDS),
    avatar: generatePicture()
  };
};

const generateData = ({categories, articles, users}) => ({
  categories: categories.map((item) => ({title: item})),
  articles,
  users: users.map(generateUser)
});

module.exports = {
  generateData,
  generateUser,
  generatePicture,
  getDataFromDataFiles,
  getAnnounce,
  getCategories,
  getCommentText,
  getId,
  getRandomDate,
  getRandomIndex,
  getRandomItem,
  getFullText
};
