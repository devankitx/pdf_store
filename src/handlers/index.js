const { handleStart } = require("./startHandler");
const { handleCallback } = require("./callbackHandler");
const { handleMessage } = require("./messageHandler");
const { handleAdmin } = require("./adminHandler");

function registerHandlers(bot) {
  bot.onText(/\/start/, handleStart(bot));
  bot.onText(/\/admin/, handleAdmin(bot));
  bot.on("callback_query", handleCallback(bot));
  bot.on("message", handleMessage(bot));
}

module.exports = {
  registerHandlers
};