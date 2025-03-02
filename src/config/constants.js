const path = require("path");

module.exports = {
  TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  ADMIN_CHAT_ID: process.env.ADMIN_CHAT_ID,
  PUBLIC_FOLDER: path.join(__dirname, "../../public"),
  IMAGES_FOLDER: path.join(__dirname, "../../public/images")
};