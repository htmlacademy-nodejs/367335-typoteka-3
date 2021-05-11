'use strict';

const {DataTypes} = require(`sequelize`);
const setVarchar = DataTypes.STRING;

const define = (sequelize) => sequelize.define(`Article`, {
  title: {
    type: setVarchar(250),
    allowNull: false
  },
  announce: {
    type: setVarchar(250),
    allowNull: false
  },
  fullText: {
    type: setVarchar(1000)
  },
  picture: {
    type: setVarchar(256)
  },
  pubDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

module.exports = define;
