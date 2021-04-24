const Slimbot = require("slimbot");

const amazon = require("./parsers/amazon");
const logger = require("./logger");
const db = require("./db");
const { onSubscribe } = require("./handlers/subscribe");
const { onUnsubscribe } = require("./handlers/unsubscribe");
const { onHelp } = require("./handlers/help");
const { crawl } = require("./crawler");
const { getRandomArbitrary } = require("./utils");

const slimbot = new Slimbot(process.env["TELEGRAM_BOT_TOKEN"]);
const adminId = process.env["TELEGRAM_ADMIN_ID"];

function buildUser(chat) {
  return {
    id: chat.id,
    username: chat.username || `${chat.first_name}_${chat.last_name}`,
  };
}

slimbot.on("message", async (message) => {
  logger.message(message);

  const { chat, text } = message;
  const user = buildUser(chat);

  switch (text) {
    case "/sub": {
      return await onSubscribe(slimbot, chat, user);
    }
    case "/unsub": {
      return await onUnsubscribe(slimbot, chat, user);
    }
    case "/help": {
      return onHelp(slimbot, chat);
    }
    default:
      return onHelp(slimbot, chat);
  }
});

async function runCrawler() {
  users = await db.user.list();

  if (users.length) {
    result = await crawl(amazon, slimbot);

    if (result.status >= 500) {
      slimbot.sendMessage(adminId, "Amazon might have blocked request");
    }

    if (result.message) {
      users.forEach(({ id }) => {
        slimbot.sendMessage(id, result.message);
      });
    }
  }

  setTimeout(async () => {
    runCrawler();
  }, 1e3 * 60 * getRandomArbitrary(0.2, 0.8));
}

function start() {
  logger.log("Bot started");

  slimbot.startPolling();
  runCrawler();
}

start();
