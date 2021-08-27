'use strict';

const {MaxValue} = require(`../../constants`);
const {DATE, NOW, setVarchar} = require(`./common`);

const define = (sequelize) => sequelize.define(`Article`, {
  title: {
    type: setVarchar(MaxValue.TITLE),
    allowNull: false
  },
  announce: {
    type: setVarchar(MaxValue.ANNOUNCE),
    allowNull: false
  },
  fullText: {
    type: setVarchar(MaxValue.TEXT)
  },
  picture: {
    type: setVarchar(MaxValue.FILENAME)
  },
  pubDate: {
    type: DATE,
    allowNull: false,
    defaultValue: NOW
  }
});

module.exports = define;
