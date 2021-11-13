'use strict';

class UsersService {
  constructor({models}) {
    this._User = models.User;
  }

  async create(userData) {
    const user = await this._User.create(userData);

    return user.get();
  }

  async findByEmail(email) {
    const userData = await this._User.findOne({
      where: {email}
    });

    const user = userData && userData.get();

    if (user && user.id) {
      user.isAdmin = user.id === 1;
    }

    return user;
  }
}

module.exports = UsersService;
