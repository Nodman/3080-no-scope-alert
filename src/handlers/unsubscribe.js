const db = require("../db");

const RESPONSE = "Removed from subs list";
const RESPONSE_FALLBACK = "You are not subscribed, type /sub to subscribe";

async function onUnsubscribe(slimbot, chat, user) {
  const removeUser = await db.user.remove(user.id);

  slimbot.sendMessage(chat.id, removeUser ? RESPONSE : RESPONSE_FALLBACK);
}

module.exports = { onUnsubscribe };
