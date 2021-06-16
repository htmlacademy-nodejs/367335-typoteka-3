'use strict';

const {writeFile} = require(`fs`).promises;
const {FIRST_ID, TextLength} = require(`../../constants`);
const {getRandomInt, outputRes} = require(`../../utils`);
const {
  generatePerson,
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

const generatePeople = (people) => people.map((person) => {
  const {firstName, lastName, email, passwordHash, avatar} = generatePerson(person);

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

const generateArticles = (articlesCount, peopleCount, sentences, titles) => {
  return Array(articlesCount).fill([]).map(() => [
    `'${getRandomItem(titles)}'`,
    `'${getAnnounce(sentences, TextLength.SHORT)}'`,
    `'${getFullText(sentences, TextLength.LONG)}'`,
    `'${generatePicture()}'`,
    `'${getRandomDate()}'`,
    `CURRENT_TIMESTAMP`,
    `CURRENT_TIMESTAMP`,
    getRandomInt(FIRST_ID, peopleCount)
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

const generateComments = (articlesCount, peopleCount, comments) => {
  const {MIN, MAX} = CommentsRestrict;

  return Array(articlesCount).fill(1).reduce((acc, item, articleId) => [
    ...acc,
    ...Array(getRandomInt(MIN, MAX)).fill(articleId).map(() => [
      `'${getCommentText(comments, CommentsRestrict, TextLength.SHORT)}'`,
      `CURRENT_TIMESTAMP`,
      `CURRENT_TIMESTAMP`,
      getRandomInt(FIRST_ID, peopleCount),
      articleId + 1
    ])
  ], []);
};

const formatSqlValues = (rows) => `(${rows.map((row) => row.join(`, `)).join(`),\n(`)});`;

const generateSql = ({
  articlesCount,
  people,
  categories,
  comments,
  sentences,
  titles
}) => `-- Сгенерировано командой ./src/service/service.js "--fill" "${articlesCount}"

DO $$ BEGIN

-- Очистка БД
DELETE FROM public."People";
DELETE FROM public."Categories";
DELETE FROM public."Articles";
PERFORM setval('public."Articles_id_seq"'::regclass, 1, false);
PERFORM setval('public."People_id_seq"'::regclass, 1, false);
PERFORM setval('public."Categories_id_seq"'::regclass, 1, false);
PERFORM setval('public."Comments_id_seq"'::regclass, 1, false);

-- Добавление пользователей
INSERT INTO public."People" ("firstName", "lastName", "email", "passwordHash", "avatar", "createdAt", "updatedAt") VALUES
${formatSqlValues(generatePeople(people))}

-- Добавление категорий
INSERT INTO public."Categories" ("title", "createdAt", "updatedAt") VALUES
${formatSqlValues(generateCategories(categories))}

-- Добавление публикаций
INSERT INTO public."Articles" ("title", "announce", "fullText", "picture", "pubDate", "createdAt", "updatedAt", "PersonId") VALUES
${formatSqlValues(generateArticles(articlesCount, people.length, sentences, titles))}

-- Добавление комментариев
INSERT INTO public."Comments" ("text", "createdAt", "updatedAt", "PersonId", "ArticleId") VALUES
${formatSqlValues(generateComments(articlesCount, people.length, comments))}

-- Связь публикаций с категориями
INSERT INTO public."ArticleCategories" ("createdAt", "updatedAt", "ArticleId", "CategoryId") VALUES
${formatSqlValues(generateArticlesToCategories(articlesCount, categories.length))}

END $$;`;

module.exports = {
  name: `--fill`,
  async run([countStr]) {
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
