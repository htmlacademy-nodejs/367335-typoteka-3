'use strict';

const {TextLength: {SHORT}} = require(`../../constants`);
const {setVarchar} = require(`./common`);

const define = (sequelize) => sequelize.define(`Comment`, {
  text: {
    type: setVarchar(SHORT),
    allowNull: false
  }
});

module.exports = define;
