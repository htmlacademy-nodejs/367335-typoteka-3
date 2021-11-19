'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);
const itemExistsChecker = require(`../middlewares/item-exists-checker`);
const schemaValidator = require(`../middlewares/schema-validator`);
const schema = require(`../schema`);

module.exports = (app, categoriesService) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await categoriesService.findAll(Number(count));
    return res.status(StatusCodes.OK).json(categories);
  });

  route.post(`/`, schemaValidator(schema.category), async (req, res) => {
    const category = await categoriesService.create(req.body.title);
    res.status(StatusCodes.CREATED).json(category);
  });

  route.put(`/:id`, [
    schemaValidator(schema.categoryRouteParams, true),
    itemExistsChecker(categoriesService),
    schemaValidator(schema.category)
  ], async ({params: {id}, body: {title}}, res) => {
    const updatedCategory = await categoriesService.update(id, title);
    return res.status(StatusCodes.OK).json(updatedCategory);
  });

  route.delete(`/:id`, [
    schemaValidator(schema.categoryRouteParams, true),
    itemExistsChecker(categoriesService)
  ], async ({params: {id}}, res) => {
    const deletedCategory = await categoriesService.drop(Number(id));
    res.status(StatusCodes.OK).json(deletedCategory);
  });
};
