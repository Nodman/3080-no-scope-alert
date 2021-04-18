const db = require("../db");

const RESPONSE = "Subscribed";
const RESPONSE_FALLBACK =
  "Already subscribed, type /unsub to remove subscription";

async function onSubscribe(slimbot, chat, user) {
  const addedUser = await db.user.add(user);

  slimbot.sendMessage(chat.id, addedUser ? RESPONSE : RESPONSE_FALLBACK);
}

module.exports = { onSubscribe };
