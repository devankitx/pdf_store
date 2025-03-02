const { ADMIN_CHAT_ID } = require("../config/constants");
const { pendingTransactions } = require("../data/state");

function handleAdmin(bot) {
  return (msg) => {
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
  };
}

module.exports = {
  handleAdmin,
};
