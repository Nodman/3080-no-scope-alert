const colors = require('colors/safe');

const _console = {
  log: (message, ...rest) => console.log(colors.green(message), ...rest),
  warn: (message, ...rest) => console.warn(colors.yellow(message), ...rest),
  error: (message, ...rest) => console.error(colors.red(message), ...rest),
}

function getCurrentDate() {
  return new Date().toLocaleString("en-US");
}

function log(message, level = "log", prefix = "__") {
  _console[level]("%s: [%s] %s", prefix, getCurrentDate(), message);
}

function logDb(message, level) {
  log(message, level, "db");
}

function logMessage({ chat, text }) {
  _console.log(
    "->: [%s] from: %d@%s (%s %s) - %s",
    getCurrentDate(),
    chat.id,
    chat.username,
    chat.first_name,
    chat.last_name,
    text
  );
}

module.exports = {
  log,
  db: logDb,
  message: logMessage,
};
