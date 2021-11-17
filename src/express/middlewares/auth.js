'use strict';

module.exports = (isAdminRoute = true) => (req, res, next) => {
  const {user} = req.session;

  if (!user || isAdminRoute && !user.isAdmin) {
    return res.redirect(`/login`);
  }

  return next();
};
