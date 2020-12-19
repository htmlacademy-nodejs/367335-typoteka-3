'use strict';

const {
  getRandomInt
} = require(`../../utils`);

const {
  getFullText,
  getAnnounce,
  getCommentText,
  getRandomDate,
  getId,
  getRandomItem,
  writeArticlesMockFile
} = require(`../lib/mock-utils`);

const bcrypt = require(`bcrypt`);

const MOCK_FILE_NAME = `fill-db.sql`;
const SALT_ROUNDS = 10;
const FIRST_ID = 1;
const SHORT_TEXT_LIMIT = 250;
const LONG_TEXT_LIMIT = 1000;

const EmailRestrict = {
  MIN: 4,
  MAX: 12
};
const emailDomains = [`ru`, `com`, `net`, `academy`];

const PasswordRestrict = {
  MIN: 6,
  MAX: 12
};

const PictureRestrict = {
  MIN: 3,
  MAX: 16
};
const imgExtensions = [`jpg`, `png`];

const CommentsRestrict = {
  MIN: 2,
  MAX: 8
};

const generatePicture = () => {
  const imgLength = getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX);
  return `'${getId(imgLength).toLowerCase()}.${getRandomItem(imgExtensions)}'`;
};

const generatePeoples = (peoples) => peoples.map((user) => {
  const emailPrependLength = getRandomInt(EmailRestrict.MIN, EmailRestrict.MAX);
  const emailAppendLength = getRandomInt(EmailRestrict.MIN, EmailRestrict.MAX);
  const passwordLength = getRandomInt(PasswordRestrict.MIN, PasswordRestrict.MAX);
  const [firstName, lastName] = user.split(` `);

  return [
    `'${firstName}'`,
    `'${lastName}'`,
    `'${getId(emailPrependLength)}@${getId(emailAppendLength)}.${getRandomItem(emailDomains)}'`,
    `'${bcrypt.hashSync(getId(passwordLength), SALT_ROUNDS)}'`,
    generatePicture()
  ];
});

const generateCategories = (categories) => categories.map((category) => [
  `'${category}'`
]);

const generateArticles = (articlesCount, peoplesCount, sentences, titles) => {
  return Array(articlesCount).fill([]).map(() => [
    `'${getRandomItem(titles)}'`,
    `'${getAnnounce(sentences, SHORT_TEXT_LIMIT)}'`,
    `'${getFullText(sentences, LONG_TEXT_LIMIT)}'`,
    generatePicture(),
    `'${getRandomDate()}'`,
    getRandomInt(FIRST_ID, peoplesCount)
  ]);
};

const generateArticlesToCategories = (articlesCount, categoriesCount) => {
  return Array(articlesCount).fill(1).reduce((acc, item, offerId) => {
    const randomCount = getRandomInt(FIRST_ID, categoriesCount);
    const rows = Array(randomCount).fill(1).map(() => getRandomInt(FIRST_ID, categoriesCount));

    return [
      ...acc,
      ...(Array.from(new Set(rows))).map((categoryId) => [
        offerId + 1,
        categoryId
      ])
    ];
  }, []);
};

const generateComments = (articlesCount, peoplesCount, comments) => {
  const {MIN, MAX} = CommentsRestrict;

  return Array(articlesCount).fill(1).reduce((acc, item, offerId) => [
    ...acc,
    ...Array(getRandomInt(MIN, MAX)).fill(offerId).map(() => [
      `'${getCommentText(comments, CommentsRestrict, SHORT_TEXT_LIMIT)}'`,
      getRandomInt(FIRST_ID, peoplesCount),
      offerId + 1
    ])
  ], []);
};

const formatSqlValues = (rows) => `(${rows.map((row) => row.join(`, `)).join(`),\n(`)});`;

const generateSql = ({
  articlesCount,
  peoples,
  categories,
  comments,
  sentences,
  titles
}) => `-- Сгенерировано командой ./src/service/service.js "--fill" "${articlesCount}"

-- Добавление пользователей
INSERT INTO public.peoples (first_name, last_name, email, password_hash, avatar) VALUES
${formatSqlValues(generatePeoples(peoples))}

-- Добавление категорий
INSERT INTO public.categories (title) VALUES
${formatSqlValues(generateCategories(categories))}

-- Добавление публикаций
INSERT INTO public.articles (title, announce, full_text, picture, pub_date, people_id) VALUES
${formatSqlValues(generateArticles(articlesCount, peoples.length, sentences, titles))}

-- Добавление комментариев
INSERT INTO public.comments (text, people_id, article_id) VALUES
${formatSqlValues(generateComments(articlesCount, peoples.length, comments))}

-- Связь публикаций с категориями
INSERT INTO public.articles_categories (article_id, category_id) VALUES
${formatSqlValues(generateArticlesToCategories(articlesCount, categories.length))}
`;

module.exports = {
  name: `--fill`,
  run([countStr]) {
    writeArticlesMockFile(countStr, generateSql, MOCK_FILE_NAME);
  }
};
