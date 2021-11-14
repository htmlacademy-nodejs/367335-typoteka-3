'use strict';

const {writeFile} = require(`fs`).promises;
const {FIRST_ID, MaxValue} = require(`../../constants`);
const {getRandomInt, outputRes} = require(`../../utils`);
const {
  generateUser,
  generatePicture,
  getDataFromDataFiles,
  getFullText,
  getAnnounce,
  getCommentText,
  getRandomDate,
  getRandomItem
} = require(`../lib/mock-utils`);

const MOCK_FILE_NAME = `fill-db.sql`;

const CommentsRestrict = {
  MIN: 2,
  MAX: 8
};

const generateUsers = (users) => users.map((user) => {
  const {firstName, lastName, email, passwordHash, avatar} = generateUser(user);

  return [
    `'${firstName}'`,
    `'${lastName}'`,
    `'${email}'`,
    `'${passwordHash}'`,
    `'${avatar}'`,
    `CURRENT_TIMESTAMP`,
    `CURRENT_TIMESTAMP`
  ];
});

const generateCategories = (categories) => categories.map((category) => [
  `'${category}'`,
  `CURRENT_TIMESTAMP`,
  `CURRENT_TIMESTAMP`
]);

const generateArticles = (articlesCount, usersCount, sentences, titles) => {
  return Array(articlesCount).fill([]).map(() => [
    `'${getRandomItem(titles)}'`,
    `'${getAnnounce(sentences, MaxValue.ANNOUNCE)}'`,
    `'${getFullText(sentences, MaxValue.TEXT)}'`,
    `'${generatePicture()}'`,
    `'${getRandomDate()}'`,
    `CURRENT_TIMESTAMP`,
    `CURRENT_TIMESTAMP`,
    getRandomInt(FIRST_ID, usersCount)
  ]);
};

const generateArticlesToCategories = (articlesCount, categoriesCount) => {
  return Array(articlesCount).fill(1).reduce((acc, item, articleId) => {
    const randomCount = getRandomInt(FIRST_ID, categoriesCount);
    const rows = Array(randomCount).fill(1).map(() => getRandomInt(FIRST_ID, categoriesCount));

    return [
      ...acc,
      ...(Array.from(new Set(rows))).map((categoryId) => [
        `CURRENT_TIMESTAMP`,
        `CURRENT_TIMESTAMP`,
        articleId + 1,
        categoryId
      ])
    ];
  }, []);
};

const generateComments = (articlesCount, usersCount, comments) => {
  const {MIN, MAX} = CommentsRestrict;

  return Array(articlesCount).fill(1).reduce((acc, item, articleId) => [
    ...acc,
    ...Array(getRandomInt(MIN, MAX)).fill(articleId).map(() => [
      `'${getCommentText(comments, CommentsRestrict, MaxValue.COMMENT)}'`,
      `CURRENT_TIMESTAMP`,
      `CURRENT_TIMESTAMP`,
      getRandomInt(FIRST_ID, usersCount),
      articleId + 1
    ])
  ], []);
};

const formatSqlValues = (rows) => `(${rows.map((row) => row.join(`, `)).join(`),\n(`)});`;

const generateSql = ({
  articlesCount,
  users,
  categories,
  comments,
  sentences,
  titles
}) => `-- Сгенерировано командой ./src/service/service.js "--fill" "${articlesCount}"

DO $$ BEGIN

-- Очистка БД
DELETE FROM public."Users";
DELETE FROM public."Categories";
DELETE FROM public."Articles";
PERFORM setval('public."Articles_id_seq"'::regclass, 1, false);
PERFORM setval('public."Users_id_seq"'::regclass, 1, false);
PERFORM setval('public."Categories_id_seq"'::regclass, 1, false);
PERFORM setval('public."Comments_id_seq"'::regclass, 1, false);

-- Добавление пользователей
INSERT INTO public."Users" ("firstName", "lastName", "email", "passwordHash", "avatar", "createdAt", "updatedAt") VALUES
${formatSqlValues(generateUsers(users))}

-- Добавление категорий
INSERT INTO public."Categories" ("title", "createdAt", "updatedAt") VALUES
${formatSqlValues(generateCategories(categories))}

-- Добавление публикаций
INSERT INTO public."Articles" ("title", "announce", "fullText", "picture", "pubDate", "createdAt", "updatedAt", "UserId") VALUES
${formatSqlValues(generateArticles(articlesCount, users.length, sentences, titles))}

-- Добавление комментариев
INSERT INTO public."Comments" ("text", "createdAt", "updatedAt", "UserId", "ArticleId") VALUES
${formatSqlValues(generateComments(articlesCount, users.length, comments))}

-- Связь публикаций с категориями
INSERT INTO public."ArticleCategories" ("createdAt", "updatedAt", "ArticleId", "CategoryId") VALUES
${formatSqlValues(generateArticlesToCategories(articlesCount, categories.length))}

END $$;`;

module.exports = {
  name: `--fill`,
  async run([countStr = 1]) {
    const data = await getDataFromDataFiles(countStr);
    const content = generateSql(data);

    try {
      await writeFile(MOCK_FILE_NAME, content);
      outputRes(`Operation success. File ${MOCK_FILE_NAME} created. Articles - ${countStr}`, `SUCCESS`);
    } catch (err) {
      console.error(err);
      outputRes(`Can't write data to file...`, `ERROR`);
    }
  }
};
