'use strict';

const {MOCK_FILE_NAME} = require(`../../constants`);
const {readFile} = require(`fs`).promises;

let data = [];

const getMockData = async () => {
  if (data.length) {
    return data;
  }

  try {
    const fileContent = await readFile(MOCK_FILE_NAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    console.error(err);
  }

  return data;
};

module.exports = getMockData;
