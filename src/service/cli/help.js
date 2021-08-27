'use strict';

const {outputRes} = require(`../../utils`);

const HELP_CONTENT = `
Программа запускает http-сервер и наполняет БД.

    Гайд:
    server <command>
    Команды:
    --version:            выводит номер версии
    --help:               печатает этот текст
    --server:             запускает сервер API
    --fill <count>:       генерирует SQL для наполнения БД
    --filldb <count>:     наполняет БД
`;

module.exports = {
  name: `--help`,
  run() {
    outputRes(HELP_CONTENT, `HELP`);
  }
};
