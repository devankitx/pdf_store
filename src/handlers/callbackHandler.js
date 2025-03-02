const { ADMIN_CHAT_ID } = require("../config/constants");
const QR_CODES = require("../data/qrCodes");
const pdfs = require("../data/pdfs");
const prices = require("../data/prices");
const { pendingTransactions, userTransactions } = require("../data/state");
const { handleCengageMenus } = require("./menus/cengageMenus");
const { handlePWMenus } = require("./menus/pwMenus");

function handleCallback(bot) {
  return async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // Handle Cengage menus
    if (data === "select_cengage" || data.startsWith("cengage_")) {
      return handleCengageMenus(bot, chatId, data, query);
    }
    
    // Handle PW menus
    if (data === "select_pw" || data.startsWith("pw_")) {
      return handlePWMenus(bot, chatId, data, query);
    }

    // Handle start menu
    if (data === "start") {
      bot.deleteMessage(chatId, query.message.message_id);
      bot.sendMessage(chatId, "📚 Welcome! Choose your study material:", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Cengage", callback_data: "select_cengage" }],
            [{ text: "PW", callback_data: "select_pw" }],
          ],
        },
      });
      return;
    }

    // Handle buy requests
    if (data.startsWith("buy_")) {
      const pdfKey = data.split("_").slice(1).join("_");
      
      // Check if the PDF is available or coming soon
      if (pdfs[pdfKey] === "PDF coming soon") {
        bot.sendMessage(chatId, "This content is coming soon! Please check back later.");
        return;
      }

      const transactionRef = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      pendingTransactions[transactionRef] = {
        chatId,
        pdfKey,
        timestamp: Date.now(),
        status: "pending",
      };

      try {
        await bot.sendPhoto(chatId, QR_CODES[pdfKey] || QR_CODES.default, {
          caption:
            `📱 Scan this QR code to pay ${prices.chapterwise}\n\n` +
            `⚠️ IMPORTANT:\n` +
            `1. Add this reference number in payment note/description:\n` +
            `${transactionRef}\n\n` +
            `2. After payment, send the screenshot or transaction ID here.`,
        });

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
      return;
    }

    // Handle admin approval/rejection
    if (
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
            `📄 Here is your PDF: ${pdfs[pdfKey]}\n\n` +
            `Want to buy another PDF?`,
            {
              reply_markup: {
                inline_keyboard: [
                  [{ text: "📚 Buy More PDFs", callback_data: "start" }]
                ]
              }
            }
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
            "If you believe this is an error, please contact our support with your reference number.\n\n" +
            "Would you like to try purchasing again?",
            {
              reply_markup: {
                inline_keyboard: [
                  [{ text: "🔄 Try Again", callback_data: `buy_${pdfKey}` }],
                  [{ text: "📚 Choose Different PDF", callback_data: "start" }]
                ]
              }
            }
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
  };
}

module.exports = {
  handleCallback
};