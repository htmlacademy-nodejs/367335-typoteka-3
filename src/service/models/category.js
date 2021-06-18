'use strict';

const {SMALLINT, setVarchar} = require(`./common`);

const define = (sequelize) => sequelize.define(`Category`, {
  id: {
    type: SMALLINT,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: setVarchar(30),
    allowNull: false
  }
});

module.exports = define;
