'use strict';

const {ExitCode} = require(`../../constants`);
const {exitWithLog, getRandomInt, getRandomIndex, getRandomItem, shuffle} = require(`../../utils`);
const {writeFile} = require(`fs`);
const moment = require(`moment`);

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучше рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`
];

const SENTENCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const PostsRestrict = {
  MIN: 1,
  MAX: 1000
};

const AnnounceRestrinct = {
  MIN: 1,
  MAX: 5
};

const FILE_NAME = `mocks.json`;
const DATE_SUBTRACT_ENTITY = `days`;
const DATE_SUBTRACT_MAX = 90;
const DATE_FORMAT = `YYYY-MM-DD HH:mm:ss`;
const SENTENCE_DELIMS = [` `, `\n`];

const generatePosts = (count) => (Array(count).fill({}).map(() => ({
  title: getRandomItem(TITLES),
  announce: shuffle(SENTENCES).slice(0, getRandomInt(AnnounceRestrinct.MIN + 1, AnnounceRestrinct.MAX)).join(SENTENCE_DELIMS[0]),
  fullText: shuffle(SENTENCES).slice(0, getRandomIndex(SENTENCES)).join(getRandomItem(SENTENCE_DELIMS)),
  createdDate: moment().subtract(getRandomInt(0, DATE_SUBTRACT_MAX), DATE_SUBTRACT_ENTITY).format(DATE_FORMAT),
  category: shuffle(CATEGORIES).slice(0, getRandomIndex(CATEGORIES) || 1)
})));

module.exports = {
  name: `--generate`,
  run([countStr]) {
    const count = +countStr || PostsRestrict.MIN;

    if (count > PostsRestrict.MAX) {
      exitWithLog(`Не больше ${PostsRestrict.MAX} публикаций`);
    }

    writeFile(FILE_NAME, JSON.stringify(generatePosts(count)), (err) => {
      if (err) {
        exitWithLog(`Ошибка записи данных в файл...`);
      }

      exitWithLog(`Операция прошла успешно. Файл создан, записей - ${count}.`, ExitCode.SUCCESS);
    });
  }
};
