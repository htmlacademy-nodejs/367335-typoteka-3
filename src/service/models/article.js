'use strict';

const {TextLength: {SHORT, LONG}} = require(`../../constants`);
const {DATE, NOW, setVarchar} = require(`./common`);

const define = (sequelize) => sequelize.define(`Article`, {
  title: {
    type: setVarchar(SHORT),
    allowNull: false
  },
  announce: {
    type: setVarchar(SHORT),
    allowNull: false
  },
  fullText: {
    type: setVarchar(LONG)
  },
  picture: {
    type: setVarchar(SHORT)
  },
  pubDate: {
    type: DATE,
    allowNull: false,
    defaultValue: NOW
  }
});

module.exports = define;
