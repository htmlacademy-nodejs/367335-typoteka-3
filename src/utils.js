'use strict';

const {ExitCode} = require(`./constants`);
const {green, red} = require(`chalk`);

/**
 * Перемешивает массив по алгоритму Фишера—Йетса.
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
 * Возвращает случайное число в диапазоне `min` и `max`.
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
 * Завершает процесс с переданным кодом, выводя переданный текст
 * В случае успеха цвет текста зеленый, в случае ошибки - красный
 *
 * @param {String} text
 * @param {Number} [exitCode=0]
 */
const exitWithLog = (text, exitCode = ExitCode.ERROR) => {
  const logMethod = (exitCode === ExitCode.ERROR) ? `error` : `info`;
  const logToner = (exitCode === ExitCode.ERROR) ? red : green;
  console[logMethod](logToner(text));
  process.exit(exitCode);
};

module.exports = {
  exitWithLog,
  getRandomIndex,
  getRandomInt,
  getRandomItem,
  shuffle
};
