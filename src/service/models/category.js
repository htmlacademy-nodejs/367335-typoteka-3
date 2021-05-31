'use strict';

const {DataTypes} = require(`sequelize`);
const setVarchar = DataTypes.STRING;

const define = (sequelize) => sequelize.define(`Category`, {
  id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: setVarchar(30),
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Category`,
  tableName: `categories`
});

module.exports = define;
