'use strict';

module.exports = {
  DEFAULT_API_PORT: 3000,
  FIRST_ID: 1,
  ARTICLES_PER_PAGE: 8,
  USERNAME_PATTERN: `^[А-ЯА-яЁёA-Za-z]{1,100}$`,
  POPULARS_COUNT: 4,
  Env: {
    DEVELOPMENT: `development`,
    PRODUCTION: `production`
  },
  ExitCode: {
    ERROR: 1,
    SUCCESS: 0
  },
  LogMode: {
    DEFAULT: {
      color: `white`,
      method: `log`
    },
    ERROR: {
      color: `red`,
      method: `error`,
      exitCode: `ERROR`
    },
    HELP: {
      color: `gray`,
      method: `info`
    },
    INFO: {
      color: `blue`,
      method: `info`
    },
    SUCCESS: {
      color: `green`,
      method: `info`,
      exitCode: `SUCCESS`
    }
  },
  MinValue: {
    TITLE: 30,
    ANNOUNCE: 30,
    TEXT: 30,
    CATEGORY: 5,
    COMMENT: 20,
    PASSWORD: 6,
    SUM: 100
  },
  MaxValue: {
    FIRST_NAME: 100,
    LAST_NAME: 100,
    EMAIL: 100,
    TITLE: 250,
    ANNOUNCE: 250,
    TEXT: 1000,
    CATEGORY: 30,
    COMMENT: 250,
    PASSWORD: 128,
    FILENAME: 256
  },
  HttpMethod: {
    GET: `GET`,
    POST: `POST`,
    PUT: `PUT`,
    DELETE: `DELETE`
  }
};
