const prices = require("../../data/prices");

function handlePWMenus(bot, chatId, data, query) {
  if (data === "select_pw") {
    bot.sendMessage(chatId, "Select PW material type:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Complete Set of PCM", callback_data: "pw_complete_set" }],
          [{ text: "Maths", callback_data: "pw_maths" }],
          [{ text: "Physics", callback_data: "pw_physics" }],
          [{ text: "Chemistry", callback_data: "pw_chemistry" }],
          [{ text: "« Back", callback_data: "start" }],
        ],
      },
    });
  } else if (data === "pw_maths") {
    bot.sendMessage(
      chatId,
      `Select PW Maths chapter (${prices.chapterwise} each):`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Chapter 1", callback_data: "buy_pw_maths_chapter1" }],
            [{ text: "Chapter 2", callback_data: "buy_pw_maths_chapter2" }],
            [{ text: "Chapter 3", callback_data: "buy_pw_maths_chapter3" }],
            [{ text: "Chapter 4", callback_data: "buy_pw_maths_chapter4" }],
            [{ text: "« Back", callback_data: "select_pw" }],
          ],
        },
      }
    );
  } else if (data === "pw_physics") {
    bot.sendMessage(
      chatId,
      `Select PW Physics chapter (${prices.chapterwise} each):`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Chapter 1", callback_data: "buy_pw_physics_chapter1" }],
            [{ text: "Chapter 2", callback_data: "buy_pw_physics_chapter2" }],
            [{ text: "Chapter 3", callback_data: "buy_pw_physics_chapter3" }],
            [{ text: "Chapter 4", callback_data: "buy_pw_physics_chapter4" }],
            [{ text: "« Back", callback_data: "select_pw" }],
          ],
        },
      }
    );
  } else if (data === "pw_chemistry") {
    bot.sendMessage(
      chatId,
      `Select PW Chemistry chapter (${prices.chapterwise} each):`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Chapter 1", callback_data: "buy_pw_chemistry_chapter1" }],
            [{ text: "Chapter 2", callback_data: "buy_pw_chemistry_chapter2" }],
            [{ text: "Chapter 3", callback_data: "buy_pw_chemistry_chapter3" }],
            [{ text: "Chapter 4", callback_data: "buy_pw_chemistry_chapter4" }],
            [{ text: "« Back", callback_data: "select_pw" }],
          ],
        },
      }
    );
  } else if (data === "pw_complete_set") {
    bot.sendMessage(
      chatId,
      `Get Complete PW Set (${prices.complete_set}):`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Buy Complete Set", callback_data: "buy_pw_complete" }],
            [{ text: "« Back", callback_data: "select_pw" }],
          ],
        },
      }
    );
  }
  return true;
}

module.exports = {
  handlePWMenus
};