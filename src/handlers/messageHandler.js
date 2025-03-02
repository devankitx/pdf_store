const { ADMIN_CHAT_ID } = require("../config/constants");
const { pendingTransactions, userTransactions } = require("../data/state");
const prices = require("../data/prices");

function handleMessage(bot) {
  return async (msg) => {
    const chatId = msg.chat.id;

    // Skip if this is a command
    if (msg.text && msg.text.startsWith("/")) return;

    // Check if user has pending transactions
    if (userTransactions[chatId] && userTransactions[chatId].length > 0) {
      const txnId = msg.text;
      const hasPhoto = msg.photo && msg.photo.length > 0;

      // Get the latest transaction reference for this user
      const transactionRef =
        userTransactions[chatId][userTransactions[chatId].length - 1];

      // Only process if the transaction is still pending
      if (
        pendingTransactions[transactionRef] &&
        pendingTransactions[transactionRef].status === "pending"
      ) {
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
        userTransactions[chatId] = userTransactions[chatId].filter(
          (ref) => ref !== transactionRef
        );
      }
    }
  };
}

module.exports = {
  handleMessage,
};
