'use strict';

const {TextLength: {SHORT}} = require(`../../constants`);
const {setChar, setVarchar} = require(`./common`);

const define = (sequelize) => sequelize.define(`People`, {
  firstName: {
    type: setVarchar(100),
    allowNull: false
  },
  lastName: {
    type: setVarchar(100),
    allowNull: false
  },
  email: {
    type: setVarchar(100),
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: setChar(128),
    allowNull: false
  },
  avatar: {
    type: setVarchar(SHORT),
    allowNull: false,
    unique: true
  }
});

module.exports = define;
