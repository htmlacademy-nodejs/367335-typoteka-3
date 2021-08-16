'use strict';

const {MaxValue} = require(`../../constants`);
const {setVarchar} = require(`./common`);

const define = (sequelize) => sequelize.define(`Comment`, {
  text: {
    type: setVarchar(MaxValue.COMMENT),
    allowNull: false
  }
});

module.exports = define;
