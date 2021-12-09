'use strict';

const {Cli} = require(`./cli/main`);
const {ExitCode} = require(`../constants`);

const DEFAULT_COMMAND = `--help`;
console.log(process.argv);
const [, , userCommand = ``, ...userArguments] = process.argv;

if (!Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.SUCCESS);
}

Cli[userCommand].run(userArguments);
