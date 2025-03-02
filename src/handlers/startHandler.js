function handleStart(bot) {
  return (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "📚 Welcome! Choose your study material:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Cengage", callback_data: "select_cengage" }],
          [{ text: "PW", callback_data: "select_pw" }],
        ],
      },
    });
  };
}

module.exports = {
  handleStart,
};
