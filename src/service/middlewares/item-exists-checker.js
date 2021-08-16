'use strict';

const {capitalize} = require(`../../utils`);
const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);

module.exports = (service) => async ({params, query}, res, next) => {
  const entityName = service.entityName || service.parentEntityName;
  if (!service.findOne && !entityName) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }

  const parentItem = res.locals[service.parentEntityName];
  const [paramName, paramChildName = null] = Object.keys(params);
  const targetParamName = parentItem ? paramChildName : paramName;
  const id = params[targetParamName];

  const item = await service.findOne({
    id,
    comments: Number(params.comments || query.comments)
  });

  if (!item) {
    const reason = entityName
      ? `${capitalize(entityName)} with :${targetParamName} ${id} not found`
      : ReasonPhrases.NOT_FOUND;
    return res.status(StatusCodes.NOT_FOUND).send(reason);
  }

  res.locals[entityName] = item;
  return next();
};
