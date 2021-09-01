'use strict';

const {Aliase: {USERS}} = require(`../models/common`);

class UserRelatedService {
  constructor({models}) {
    this._User = models.User;
  }

  get _userInclusion() {
    return {
      model: this._User,
      as: USERS,
      attributes: {
        exclude: [`passwordHash`]
      }
    };
  }
}

module.exports = UserRelatedService;
