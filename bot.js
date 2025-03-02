require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Store your bot token in .env file
const bot = new TelegramBot(TOKEN, { polling: true });

const pdfs = {
  maths:
    "https://drive.google.com/file/d/1P5Y1LokIvtl4sPVrCzfoAZ5_dkfVxxno/view?usp=sharing",
  science: "https://docs.google.com/document/your-science-doc-link", // Replace with your science document link
};

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "📚 Welcome! Select a PDF to download:\n\nMaths\nScience",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Get Maths PDF", callback_data: "get_maths" }],
          [{ text: "Get Science PDF", callback_data: "get_science" }],
        ],
      },
    }
  );
});

// Handle button clicks
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data.startsWith("get_")) {
    const pdfKey = data.split("_")[1];

    if (pdfs[pdfKey]) {
      bot.sendMessage(
        chatId,
        `📄 Here is your ${
          pdfKey.charAt(0).toUpperCase() + pdfKey.slice(1)
        } PDF: ${pdfs[pdfKey]}`
      );
    } else {
      bot.sendMessage(
        chatId,
        "❌ Sorry, this document is not available at the moment."
      );
    }
  }
});
console.log("Bot is running...");
