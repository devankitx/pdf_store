const prices = require("../../data/prices");

function handleCengageMenus(bot, chatId, data, query) {
  if (data === "select_cengage") {
    bot.sendMessage(chatId, "Select Cengage material type:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Complete Set of 17 Books (PCM)",
              callback_data: "cengage_complete_set",
            },
          ],
          [{ text: "Maths", callback_data: "cengage_maths" }],
          [{ text: "Physics", callback_data: "cengage_physics" }],
          [{ text: "Chemistry", callback_data: "cengage_chemistry" }],
          [{ text: "« Back", callback_data: "start" }],
        ],
      },
    });
  } else if (data === "cengage_maths") {
    bot.sendMessage(chatId, "Select Cengage Maths material:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Chapter-wise",
              callback_data: "cengage_maths_chapterwise",
            },
          ],
          [{ text: "Unit-wise", callback_data: "cengage_maths_unitwise" }],
          [{ text: "Complete Set", callback_data: "cengage_maths_complete" }],
          [{ text: "« Back", callback_data: "select_cengage" }],
        ],
      },
    });
  } else if (data === "cengage_physics") {
    bot.sendMessage(chatId, "Select Cengage Physics material:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Chapter-wise",
              callback_data: "cengage_physics_chapterwise",
            },
          ],
          [{ text: "Unit-wise", callback_data: "cengage_physics_unitwise" }],
          [{ text: "Complete Set", callback_data: "cengage_physics_complete" }],
          [{ text: "« Back", callback_data: "select_cengage" }],
        ],
      },
    });
  } else if (data === "cengage_chemistry") {
    bot.sendMessage(chatId, "Select Cengage Chemistry material:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Chapter-wise",
              callback_data: "cengage_chemistry_chapterwise",
            },
          ],
          [{ text: "Unit-wise", callback_data: "cengage_chemistry_unitwise" }],
          [
            {
              text: "Complete Set",
              callback_data: "cengage_chemistry_complete",
            },
          ],
          [{ text: "« Back", callback_data: "select_cengage" }],
        ],
      },
    });
  } else if (data === "cengage_maths_chapterwise") {
    bot.sendMessage(
      chatId,
      `Select Cengage Maths chapter (${prices.chapterwise} each):`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Chapter 1",
                callback_data: "buy_cengage_maths_chapter1",
              },
            ],
            [
              {
                text: "Chapter 2",
                callback_data: "buy_cengage_maths_chapter2",
              },
            ],
            [
              {
                text: "Chapter 3",
                callback_data: "buy_cengage_maths_chapter3",
              },
            ],
            [{ text: "« Back", callback_data: "cengage_maths" }],
          ],
        },
      }
    );
  } else if (data === "cengage_physics_chapterwise") {
    // Similar pattern for physics chapters
    // ... (similar code for other Cengage menus)
  }
  // Return true to indicate the handler processed this callback
  return true;
}

module.exports = {
  handleCengageMenus
};