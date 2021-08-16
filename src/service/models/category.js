'use strict';

const {MaxValue} = require(`../../constants`);
const {SMALLINT, setVarchar} = require(`./common`);

const define = (sequelize) => sequelize.define(`Category`, {
  id: {
    type: SMALLINT,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: setVarchar(MaxValue.CATEGORY),
    allowNull: false
  }
});

module.exports = define;
