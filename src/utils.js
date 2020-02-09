'use strict';

const {ExitCode} = require(`./constants`);

/**
 * Перетасовка массива по алгоритму Фишера—Йетса.
 *
 * @param {Array} array
 * @return {Array}
 */
const shuffle = (array) => {
  const resultArray = array.slice();
  for (let i = resultArray.length - 1; i > 0; i--) {
    const randomNumber = Math.floor(Math.random() * (i + 1));
    [resultArray[randomNumber], resultArray[i]] = [resultArray[i], resultArray[randomNumber]];
  }

  return resultArray;
};

/**
 * Возвращает случайное число в диапазоне
 * `min` и `max`.
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Возвращает случайный индекс заданного массива
 *
 * @param {Array} someArray
 * @return {Number}
 */
const getRandomIndex = (someArray) => getRandomInt(0, someArray.length - 1);

/**
 * Возвращает случайный элемент заданного массива
 *
 * @param {Array} someArray
 * @return {*}
 */
const getRandomItem = (someArray) => someArray[getRandomIndex(someArray)];

/**
 * Заверщает процесс с переданным кодом, выводя переданный текст
 *
 * @param {String} text
 * @param {string} [exitKey=`ERROR`]
 */
const exitWithLog = (text, exitKey = `ERROR`) => {
  console[(exitKey === `ERROR`) ? `error` : `info`](text);
  process.exit(ExitCode[exitKey] || ExitCode.ERROR);
};

module.exports = {
  exitWithLog,
  getRandomIndex,
  getRandomInt,
  getRandomItem,
  shuffle
};
