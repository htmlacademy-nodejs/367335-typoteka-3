'use strict';

const OWNER_ENDPOINTS = [
  `/my`,
  `/articles/add`,
  `/articles/edit`,
  `/categories`
];

module.exports = (req, res, next) => {
  const {user} = req.session;

  const checkPageIsNotAllowed = (endpoint) => {
    return !user.isAdmin && req.originalUrl.startsWith(endpoint);
  };

  if (!user || OWNER_ENDPOINTS.some(checkPageIsNotAllowed)) {
    return res.redirect(`/login`);
  }

  return next();
};
