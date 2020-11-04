'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {modifyArticle, preprocessPostedArticle} = require(`../lib/articles`);

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const articlesRouter = new Router();
const api = require(`../api`).getAPI();

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirAbsolute,
    filename: (req, file, cb) => {
      const uniqueName = nanoid(10);
      const extension = file.originalname.split(`.`).pop();
      cb(null, `${uniqueName}.${extension}`);
    }
  })
});

const renderCurrentPost = async (req, res, next) => {
  try {
    const article = await api.getArticle(req.params.id);
    res.render(`post`, {article: modifyArticle(article)});
  } catch (err) {
    next();
  }
};

const renderNewPost = async (req, res) => {
  const categories = await api.getCategories();
  const post = req.body || {};
  res.render(`new-post`, {
    categories,
    post,
    setChecked(category) {
      if (!post.categories) {
        return false;
      }
      return post.categories.indexOf(category) !== -1;
    }
  });
};

articlesRouter.get(`/category/:id`, (req, res) => {
  res.render(`articles-by-category`);
});

articlesRouter.get(`/add`, renderNewPost);

articlesRouter.post(`/add`, upload.single(`picture`), async (req, res) => {
  try {
    await api.createArticle(preprocessPostedArticle(req));
    res.redirect(`/my`);
  } catch (err) {
    renderNewPost(req, res);
  }
});

articlesRouter.get(`/:id`, renderCurrentPost);

articlesRouter.get(`/edit/:id`, renderCurrentPost);

module.exports = articlesRouter;
