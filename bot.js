require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const bot = new TelegramBot(TOKEN, { polling: true });

// Create folders structure
const publicFolder = path.join(__dirname, "public");
const imagesFolder = path.join(publicFolder, "images");

if (!fs.existsSync(publicFolder)) fs.mkdirSync(publicFolder);
if (!fs.existsSync(imagesFolder)) fs.mkdirSync(imagesFolder);

// Fix QR_CODES mapping to use the same file for all products
const QR_CODES = {
  chapter1: path.join(imagesFolder, "maths_payment_qr.jpg"),
  chapter2: path.join(imagesFolder, "maths_payment_qr.jpg"),
  chapter3: path.join(imagesFolder, "maths_payment_qr.jpg"),
  unitwise: path.join(imagesFolder, "maths_payment_qr.jpg"),
  physics: path.join(imagesFolder, "maths_payment_qr.jpg"),
  chemistry: path.join(imagesFolder, "maths_payment_qr.jpg"),
  maths: path.join(imagesFolder, "maths_payment_qr.jpg"),
  complete: path.join(imagesFolder, "maths_payment_qr.jpg")
};

const pdfs = {
  chapter1:
    "https://drive.google.com/file/d/1P5Y1LokIvtl4sPVrCzfoAZ5_dkfVxxno/view?usp=sharing",
  chapter2:
    "https://drive.google.com/file/d/1P5Y1LokIvtl4sPVrCzfoAZ5_dkfVxxno/view?usp=sharing",
  chapter3:
    "https://drive.google.com/file/d/1P5Y1LokIvtl4sPVrCzfoAZ5_dkfVxxno/view?usp=sharing",
  unitwise:
    "https://drive.google.com/file/d/1P5Y1LokIvtl4sPVrCzfoAZ5_dkfVxxno/view?usp=sharing",
  physics:
    "https://drive.google.com/file/d/1P5Y1LokIvtl4sPVrCzfoAZ5_dkfVxxno/view?usp=sharing",
  chemistry:
    "https://drive.google.com/file/d/1P5Y1LokIvtl4sPVrCzfoAZ5_dkfVxxno/view?usp=sharing",
  maths:
    "https://drive.google.com/file/d/1P5Y1LokIvtl4sPVrCzfoAZ5_dkfVxxno/view?usp=sharing",
  complete:
    "https://drive.google.com/file/d/1P5Y1LokIvtl4sPVrCzfoAZ5_dkfVxxno/view?usp=sharing",
};

const prices = {
  chapterwise: "₹499",
  unitwise: "₹999",
  physics: "₹1499",
  chemistry: "₹1499",
  maths: "₹1499",
  fullset: "₹3999",
  complete: "₹5999",
};
const pendingTransactions = {};
const userTransactions = {};

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "📚 Welcome! Choose your study material:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Cengage", callback_data: "select_cengage" }],
        [{ text: "PW", callback_data: "select_pw" }],
      ],
    },
  });
});

// Handle button clicks
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "select_cengage") {
    bot.sendMessage(chatId, "Select Cengage material type:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Chapter-wise PDF", callback_data: "cengage_chapter" }],
          [{ text: "Unit-wise PDF", callback_data: "cengage_unit" }],
          [{ text: "Full Set PCM", callback_data: "cengage_fullset" }],
          [
            {
              text: "Complete Set (17 Books PCM)",
              callback_data: "cengage_complete",
            },
          ],
        ],
      },
    });
  } else if (data === "select_pw") {
    bot.sendMessage(chatId, "PW material coming soon!", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "« Back to Main Menu", callback_data: "start" }],
        ],
      },
    });
  } else if (data === "cengage_chapter") {
    bot.sendMessage(chatId, `Select chapter (${prices.chapterwise} each):`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Chapter 1", callback_data: "buy_chapter1" }],
          [{ text: "Chapter 2", callback_data: "buy_chapter2" }],
          [{ text: "Chapter 3", callback_data: "buy_chapter3" }],
          [{ text: "« Back", callback_data: "select_cengage" }],
        ],
      },
    });
  } else if (data === "cengage_unit") {
    bot.sendMessage(chatId, `Get Unit-wise PDF (${prices.unitwise}):`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: `Buy Unit-wise PDF`, callback_data: "buy_unitwise" }],
          [{ text: "« Back", callback_data: "select_cengage" }],
        ],
      },
    });
  } else if (data === "cengage_fullset") {
    bot.sendMessage(chatId, "Select subject from Full Set PCM:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `Physics (${prices.physics})`,
              callback_data: "buy_physics",
            },
          ],
          [
            {
              text: `Chemistry (${prices.chemistry})`,
              callback_data: "buy_chemistry",
            },
          ],
          [{ text: `Maths (${prices.maths})`, callback_data: "buy_maths" }],
          [{ text: "« Back", callback_data: "select_cengage" }],
        ],
      },
    });
  } else if (data === "cengage_complete") {
    bot.sendMessage(
      chatId,
      `Get Complete Set of 17 Books PCM (${prices.complete}):`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: `Buy Complete Set`, callback_data: "buy_complete" }],
            [{ text: "« Back", callback_data: "select_cengage" }],
          ],
        },
      }
    );
  } else if (data === "start") {
    bot.deleteMessage(chatId, query.message.message_id);
    bot.sendMessage(chatId, "📚 Welcome! Choose your study material:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Cengage", callback_data: "select_cengage" }],
          [{ text: "PW", callback_data: "select_pw" }],
        ],
      },
    });
  } else if (data.startsWith("buy_")) {
    const pdfKey = data.split("_")[1];
    const transactionRef = `TXN-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    pendingTransactions[transactionRef] = {
      chatId,
      pdfKey,
      timestamp: Date.now(),
      status: "pending",
    };

    try {
      await bot.sendPhoto(chatId, QR_CODES[pdfKey] || QR_CODES.chapter1, {
        caption:
          `📱 Scan this QR code to pay ${prices[pdfKey]}\n\n` +
          `⚠️ IMPORTANT:\n` +
          `1. Add this reference number in payment note/description:\n` +
          `${transactionRef}\n\n` +
          `2. After payment, send the screenshot or transaction ID here.`,
      });

      // Store the transaction reference in a user-specific context
      if (!userTransactions[chatId]) {
        userTransactions[chatId] = [];
      }
      userTransactions[chatId].push(transactionRef);
      
    } catch (error) {
      bot.sendMessage(
        chatId,
        "Sorry, there was an error processing your request. Please try again later."
      );
    }
  } else if (
    (data.startsWith("approve_") || data.startsWith("reject_")) &&
    query.message.chat.id.toString() === ADMIN_CHAT_ID
  ) {
    const action = data.split("_")[0];
    const transactionRef = data.split("_")[1];

    if (pendingTransactions[transactionRef]) {
      const { chatId, pdfKey } = pendingTransactions[transactionRef];

      if (action === "approve") {
        pendingTransactions[transactionRef].status = "approved";

        bot.sendMessage(
          chatId,
          `✅ Payment Verified! Thank you for your purchase.\n\n` +
            `📄 Here is your PDF: ${pdfs[pdfKey]}`
        );

        bot.sendMessage(
          ADMIN_CHAT_ID,
          `✅ Payment for ${transactionRef} has been approved and PDF sent to user.`
        );
      } else {
        pendingTransactions[transactionRef].status = "rejected";

        bot.sendMessage(
          chatId,
          "❌ Your payment could not be verified. Please ensure you've sent the correct amount and transaction details.\n\n" +
            "If you believe this is an error, please contact our support with your reference number."
        );

        bot.sendMessage(
          ADMIN_CHAT_ID,
          `❌ Payment for ${transactionRef} has been rejected.`
        );
      }
    } else {
      bot.sendMessage(
        ADMIN_CHAT_ID,
        `⚠️ Transaction reference ${transactionRef} not found or already processed.`
      );
    }

    bot.editMessageReplyMarkup(
      { inline_keyboard: [] },
      {
        chat_id: ADMIN_CHAT_ID,
        message_id: query.message.message_id,
      }
    );
  }
});
// Handle all incoming messages for payment verification
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  
  // Skip if this is a command
  if (msg.text && msg.text.startsWith('/')) return;
  
  // Check if user has pending transactions
  if (userTransactions[chatId] && userTransactions[chatId].length > 0) {
    const txnId = msg.text;
    const hasPhoto = msg.photo && msg.photo.length > 0;
    
    // Get the latest transaction reference for this user
    const transactionRef = userTransactions[chatId][userTransactions[chatId].length - 1];
    
    // Only process if the transaction is still pending
    if (pendingTransactions[transactionRef] && pendingTransactions[transactionRef].status === "pending") {
      const pdfKey = pendingTransactions[transactionRef].pdfKey;
      
      bot.sendMessage(
        chatId,
        "⏳ Your payment is being verified. This may take a few minutes..."
      );

      if (ADMIN_CHAT_ID) {
        let adminMessage =
          `🔔 New payment verification needed:\n\n` +
          `Reference: ${transactionRef}\n` +
          `Product: ${pdfKey}\n` +
          `Amount: ${prices[pdfKey]}\n` +
          `User: @${msg.from.username || "No username"}\n` +
          `User ID: ${chatId}\n` +
          `Time: ${new Date().toLocaleString()}\n\n`;

        if (hasPhoto) {
          await bot.forwardMessage(ADMIN_CHAT_ID, chatId, msg.message_id);
          await bot.sendMessage(ADMIN_CHAT_ID, adminMessage);
        } else if (txnId) {
          adminMessage += `Transaction ID: ${txnId}`;
          await bot.sendMessage(ADMIN_CHAT_ID, adminMessage);
        }

        await bot.sendMessage(
          ADMIN_CHAT_ID,
          `Verify payment for ${transactionRef}:`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "✅ Approve",
                    callback_data: `approve_${transactionRef}`,
                  },
                  {
                    text: "❌ Reject",
                    callback_data: `reject_${transactionRef}`,
                  },
                ],
              ],
            },
          }
        );
      }
      
      // Remove this transaction from the user's active list
      userTransactions[chatId] = userTransactions[chatId].filter(ref => ref !== transactionRef);
    }
  }
});
// Handle /admin command
bot.onText(/\/admin/, (msg) => {
  const chatId = msg.chat.id;

  if (chatId.toString() === ADMIN_CHAT_ID) {
    let pending = 0,
      approved = 0,
      rejected = 0;

    Object.values(pendingTransactions).forEach((tx) => {
      if (tx.status === "pending") pending++;
      else if (tx.status === "approved") approved++;
      else if (tx.status === "rejected") rejected++;
    });

    bot.sendMessage(
      chatId,
      `🔐 Admin Dashboard\n\n` +
        `Transactions Summary:\n` +
        `- Pending: ${pending}\n` +
        `- Approved: ${approved}\n` +
        `- Rejected: ${rejected}\n\n` +
        `Total: ${Object.keys(pendingTransactions).length}`
    );
  }
});

// Handle errors
bot.on("polling_error", (error) => {
  console.error("Polling error:", error);
});

console.log("Bot is running...");
