'use strict';

const {MaxValue} = require(`../../constants`);
const {setChar, setVarchar} = require(`./common`);

const define = (sequelize) => sequelize.define(`User`, {
  firstName: {
    type: setVarchar(MaxValue.FIRST_NAME),
    allowNull: false
  },
  lastName: {
    type: setVarchar(MaxValue.LAST_NAME),
    allowNull: false
  },
  email: {
    type: setVarchar(MaxValue.EMAIL),
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: setChar(MaxValue.PASSWORD),
    allowNull: false
  },
  avatar: {
    type: setVarchar(MaxValue.FILENAME),
    allowNull: false,
    unique: true
  }
});

module.exports = define;
