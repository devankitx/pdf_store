require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { setupFolders } = require("./src/utils/fileSystem");
const { registerHandlers } = require("./src/handlers");
const { TOKEN } = require("./src/config/constants");

// Initialize bot
const bot = new TelegramBot(TOKEN, { polling: true });

// Setup folders
setupFolders();

// Register all handlers
registerHandlers(bot);

// Handle errors
bot.on("polling_error", (error) => {
  console.error("Polling error:", error);
});

console.log("Bot is running...");
