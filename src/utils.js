'use strict';

const {LogMode} = require(`./constants`);
const chalk = require(`chalk`);
const {readFile} = require(`fs`).promises;

/**
 * Делает первую букву строки заглавной
 *
 * @param {String} str
 * @return {String}
 */
const capitalize = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);

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
 * Выводит результат в консоль в зависимости от режима из справочника `LogMode`
 *
 * @param {*} res
 * @param {String} [modeName=`DEFAULT`]
 */
const outputRes = (res, modeName = `DEFAULT`) => {
  const {method, color} = LogMode[modeName];
  console[method](chalk[color](res));
};

/**
 * Возврашает массив строк файла
 * Пустые строки и строки из одних пробельных символов игнорируются
 *
 * @param {String} filePath
 * @return {Array}
 */
const writeFileToArray = async (filePath) => {
  try {
    const content = await readFile(filePath, `utf8`);
    return content.split(`\n`).filter((item) => item.trim());
  } catch (err) {
    outputRes(err, `ERROR`);
    return [];
  }
};

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

module.exports = {
  capitalize,
  getRandomInt,
  outputRes,
  writeFileToArray,
  shuffle
};
