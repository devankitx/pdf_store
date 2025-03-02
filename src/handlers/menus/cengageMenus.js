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
    bot.sendMessage(
      chatId,
      `Select Cengage Physics chapter (${prices.chapterwise} each):`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Chapter 1",
                callback_data: "buy_cengage_physics_chapter1",
              },
            ],
            [
              {
                text: "Chapter 2",
                callback_data: "buy_cengage_physics_chapter2",
              },
            ],
            [
              {
                text: "Chapter 3",
                callback_data: "buy_cengage_physics_chapter3",
              },
            ],
            [{ text: "« Back", callback_data: "cengage_physics" }],
          ],
        },
      }
    );
  } else if (data === "cengage_chemistry_chapterwise") {
    bot.sendMessage(
      chatId,
      `Select Cengage Chemistry chapter (${prices.chapterwise} each):`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Chapter 1",
                callback_data: "buy_cengage_chemistry_chapter1",
              },
            ],
            [
              {
                text: "Chapter 2",
                callback_data: "buy_cengage_chemistry_chapter2",
              },
            ],
            [
              {
                text: "Chapter 3",
                callback_data: "buy_cengage_chemistry_chapter3",
              },
            ],
            [{ text: "« Back", callback_data: "cengage_chemistry" }],
          ],
        },
      }
    );
  } else if (data === "cengage_maths_unitwise") {
    bot.sendMessage(
      chatId,
      `Get Cengage Maths Unit-wise PDF (${prices.unitwise}):`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Buy Unit-wise PDF",
                callback_data: "buy_cengage_maths_unitwise",
              },
            ],
            [{ text: "« Back", callback_data: "cengage_maths" }],
          ],
        },
      }
    );
  } else if (data === "cengage_physics_unitwise") {
    bot.sendMessage(
      chatId,
      `Get Cengage Physics Unit-wise PDF (${prices.unitwise}):`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Buy Unit-wise PDF",
                callback_data: "buy_cengage_physics_unitwise",
              },
            ],
            [{ text: "« Back", callback_data: "cengage_physics" }],
          ],
        },
      }
    );
  } else if (data === "cengage_chemistry_unitwise") {
    bot.sendMessage(
      chatId,
      `Get Cengage Chemistry Unit-wise PDF (${prices.unitwise}):`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Buy Unit-wise PDF",
                callback_data: "buy_cengage_chemistry_unitwise",
              },
            ],
            [{ text: "« Back", callback_data: "cengage_chemistry" }],
          ],
        },
      }
    );
  } else if (data === "cengage_maths_complete") {
    bot.sendMessage(
      chatId,
      `Get Complete Cengage Maths Set (${prices.maths_complete}):`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Buy Complete Set",
                callback_data: "buy_cengage_maths_complete",
              },
            ],
            [{ text: "« Back", callback_data: "cengage_maths" }],
          ],
        },
      }
    );
  } else if (data === "cengage_physics_complete") {
    bot.sendMessage(
      chatId,
      `Get Complete Cengage Physics Set (${prices.physics_complete}):`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Buy Complete Set",
                callback_data: "buy_cengage_physics_complete",
              },
            ],
            [{ text: "« Back", callback_data: "cengage_physics" }],
          ],
        },
      }
    );
  } else if (data === "cengage_chemistry_complete") {
    bot.sendMessage(
      chatId,
      `Get Complete Cengage Chemistry Set (${prices.chemistry_complete}):`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Buy Complete Set",
                callback_data: "buy_cengage_chemistry_complete",
              },
            ],
            [{ text: "« Back", callback_data: "cengage_chemistry" }],
          ],
        },
      }
    );
  } else if (data === "cengage_complete_set") {
    bot.sendMessage(
      chatId,
      `Get Complete Cengage Set of 17 Books PCM (${prices.complete_set}):`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `Buy Complete Set`,
                callback_data: "buy_cengage_complete",
              },
            ],
            [{ text: "« Back", callback_data: "select_cengage" }],
          ],
        },
      }
    );
  }
  // Return true to indicate the handler processed this callback
  return true;
}

module.exports = {
  handleCengageMenus,
};
