const util = require("util");
const fs = require("fs");
const path = require("path");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const logger = require("./logger");

const DB_FILE_PATH = path.resolve("./db/db.json");

async function readDBFile() {
  const rawData = await readFileAsync(DB_FILE_PATH, "utf8");

  return JSON.parse(rawData) || {};
}

async function writeDBFile(fileData) {
  return writeFileAsync(DB_FILE_PATH, JSON.stringify(fileData));
}

async function addUser(userData) {
  try {
    const db = await readDBFile();
    if (!db.users) {
      db.users = [];
    } else if (db.users.find((user) => userData.id === user.id)) {
      logger.db(`User ${userData.id} already exists`, "warn");

      return null;
    }

    db.users.push(userData);
    await writeDBFile(db);
    logger.db(`User ${userData.id} added`);

    return userData;

  } catch (error) {
    logger(`DB write error: ${error}`, 'error');
  }
}

async function getUsers() {
  const db = await readDBFile();

  return db.users || [];
}

async function removeUser(id) {
  const db = await readDBFile();
  const users = db.users || [];
  const { removed, usersUpdated } = users.reduce(
    (acc, user) => {
      if (user.id === id) {
        acc.removed = user;
      } else {
        acc.push(user);
      }

      return acc;
    },
    { removed: null, usersUpdated: [] }
  );

  if (removed) {
    await writeDBFile({ ...db, users: usersUpdated });
    logger.db(`User ${id} removed`);
  } else {
    logger.db(`User ${id} not found`, "warn");
  }

  return removed;
}

const user = {
  add: addUser,
  remove: removeUser,
  list: getUsers,
};

module.exports = {
  user,
};
