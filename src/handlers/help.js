const RESPONSE = `commands:
/sub - subscribe to notifications (every 5 min check)
/unsub - remove subscription (please unsub after you done with your order)
/help - this text`;

function onHelp(slimbot, chat) {
  slimbot.sendMessage(chat.id, RESPONSE);
}

module.exports = { onHelp };
