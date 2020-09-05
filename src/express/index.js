'use strict';

const express = require(`express`);
const {DEFAULT_PORT, Services, SERVICES_LIST} = require(`../constants`);

const app = express();

app.use(`/`, require(`./routes/index`));
for (const service of SERVICES_LIST) {
  const {alias} = Services[service];
  app.use(`/${alias}`, require(`./routes/${alias}`));
}

app.listen(DEFAULT_PORT);
