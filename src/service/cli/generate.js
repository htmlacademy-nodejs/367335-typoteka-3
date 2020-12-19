'use strict';

const {
  getAnnounce,
  getCategory,
  getCommentText,
  getFullText,
  getId,
  getRandomDate,
  getRandomIndex,
  getRandomItem,
  writeArticlesMockFile
} = require(`../lib/mock-utils`);

const generatePosts = ({articlesCount, categories, comments, sentences, titles}) => {
  return JSON.stringify(Array(articlesCount).fill({}).map(() => ({
    id: getId(),
    title: getRandomItem(titles),
    announce: getAnnounce(sentences),
    fullText: getFullText(sentences),
    createdDate: getRandomDate(),
    category: getCategory(categories),
    comments: Array(getRandomIndex(comments)).fill({}).map(() => ({
      id: getId(),
      text: getCommentText(comments, {})
    }))
  })));
};

module.exports = {
  name: `--generate`,
  run([countStr]) {
    writeArticlesMockFile(countStr, generatePosts);
  }
};
