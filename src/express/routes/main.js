'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);
const csrfProtection = require(`csurf`)({cookie: true});
const {modifyArticle, getRouteData} = require(`../lib/articles`);
const {getUrlJson, getUrlError} = require(`../../utils`);
const auth = require(`../middlewares/auth`);
const upload = require(`../middlewares/upload`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const [data, populars, lastComments] = await Promise.all([
    getRouteData(req),
    api.getArticles({isPopular: true}),
    api.getComments({isPopular: true})
  ]);

  res.render(`main`, {
    ...data,
    populars,
    lastComments
  });
});

mainRouter.get(`/categories`, [auth(), csrfProtection], async (req, res) => {
  const {user} = req.session;
  const {id, errors = `{}`, payload = `{}`} = req.query;
  const categories = await api.getCategories();

  res.render(`categories`, {
    categories,
    user,
    errors: JSON.parse(errors),
    affectedId: Number(id),
    affectedTitle: JSON.parse(payload).title,
    csrfToken: req.csrfToken()
  });
});

mainRouter.post(`/categories`, [auth(), csrfProtection], async (req, res) => {
  const {body} = req;
  const {id = 0, title, drop = false} = body;
  const successStatus = id ? StatusCodes.OK : StatusCodes.CREATED;

  delete body._csrf;

  try {
    if (drop) {
      const {message = null} = await api.dropCategory(id);
      if (message) {
        res.redirect(`/categories?id=${id + getUrlError({message})}`);
      }
    } else if (id) {
      await api.updateCategory(id, title);
    } else {
      await api.createCategory(title);
    }

    res.status(successStatus).redirect(`/categories`);
  } catch (err) {
    res.redirect(`/categories?id=${id + (id ? `` : `&payload=${getUrlJson({title})}`) + getUrlError(err)}`);
  }
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  const {query} = req.query;

  try {
    const results = await api.search(query);
    res.render(`search`, {
      results: results.map((article) => modifyArticle(article, query)),
      query,
      user
    });
  } catch (err) {
    res.render(`search`, {results: [], query, user});
  }
});

mainRouter.get(`/login`, csrfProtection, (req, res) => {
  const {payload = `{}`, errors = `{}`} = req.query;

  res.render(`login`, {
    payload: JSON.parse(payload),
    errors: Object.values(JSON.parse(errors))
  });
});

mainRouter.post(`/login`, async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await api.auth(email, password);
    req.session.user = user;
    req.session.save(() => res.redirect(`/`));
  } catch (err) {
    res.redirect(`/login?payload=${getUrlJson({email}) + getUrlError(err)}`);
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  req.session.save(() => res.redirect(`/login`));
});

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  const {payload = `{}`, errors = `{}`} = req.query;

  res.render(`sign-up`, {
    payload: JSON.parse(payload),
    errors: Object.values(JSON.parse(errors)),
    user
  });
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    ...body,
    avatar: file ? file.filename : body.pictureUploaded // если пользователь не загрузил новую картинку, оставляем прежнюю
  };
  delete userData.pictureUploaded;

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (err) {
    res.redirect(`/register?payload=${getUrlJson(userData) + getUrlError(err)}`);
  }
});

module.exports = mainRouter;
