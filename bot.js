require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const bot = new TelegramBot(TOKEN, { polling: true });

// Create public folder if it doesn't exist
const publicFolder = path.join(__dirname, "public");
const imagesFolder = path.join(publicFolder, "images");

if (!fs.existsSync(publicFolder)) {
  fs.mkdirSync(publicFolder);
  console.log("Created public folder");
}

if (!fs.existsSync(imagesFolder)) {
  fs.mkdirSync(imagesFolder);
  console.log("Created images folder");
}

// QR code image paths - create separate QR codes with fixed amounts for each product
const QR_CODES = {
  maths: path.join(imagesFolder, "maths_payment_qr.jpg"),
  science: path.join(imagesFolder, "science_payment_qr.jpg")
};

const pdfs = {
  maths:
    "https://drive.google.com/file/d/1P5Y1LokIvtl4sPVrCzfoAZ5_dkfVxxno/view?usp=sharing",
  science: "https://docs.google.com/document/your-science-doc-link", // Replace with your science document link
};

const prices = {
  maths: "₹100",
  science: "₹150"
};

// Store pending transactions
const pendingTransactions = {};

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `📚 Welcome! Select a PDF to buy:\n\nMaths - ${prices.maths}\nScience - ${prices.science}`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: `Buy Maths (${prices.maths})`, callback_data: "buy_maths" }],
          [{ text: `Buy Science (${prices.science})`, callback_data: "buy_science" }],
        ],
      },
    }
  );
});

// Handle button clicks for product selection
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data.startsWith("buy_")) {
    const pdfKey = data.split("_")[1];
    
    try {
      // Generate a unique transaction reference
      const transactionRef = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Store pending transaction
      pendingTransactions[transactionRef] = {
        chatId,
        pdfKey,
        timestamp: Date.now(),
        status: 'pending'
      };
      
      // Send QR code for payment (use product-specific QR with fixed amount)
      await bot.sendPhoto(chatId, QR_CODES[pdfKey], {
        caption: `📱 Scan this QR code to pay ${prices[pdfKey]} for the ${pdfKey.charAt(0).toUpperCase() + pdfKey.slice(1)} PDF.\n\n` +
                `The amount is already set in the QR code.\n\n` +
                `After payment, please send your Transaction ID or payment screenshot here.\n\n` +
                `Your reference number: ${transactionRef}`
      });
      
      // Listen for user response with transaction ID
      bot.once("message", async (msg) => {
        if (msg.chat.id !== chatId) return; // Ensure we're handling the right user
        
        const txnId = msg.text;
        const hasPhoto = msg.photo && msg.photo.length > 0;
        
        bot.sendMessage(chatId, "⏳ Your payment is being verified. This may take a few minutes...");

        // Notify admin for manual verification
        if (ADMIN_CHAT_ID) {
          let adminMessage = `🔔 New payment verification needed:\n\n` +
                           `Reference: ${transactionRef}\n` +
                           `Product: ${pdfKey}\n` +
                           `Amount: ${prices[pdfKey]}\n` +
                           `User ID: ${chatId}\n\n`;
          
          if (hasPhoto) {
            // Forward the payment screenshot to admin
            await bot.forwardMessage(ADMIN_CHAT_ID, chatId, msg.message_id);
            await bot.sendMessage(ADMIN_CHAT_ID, adminMessage);
          } else if (txnId) {
            adminMessage += `Transaction ID: ${txnId}`;
            await bot.sendMessage(ADMIN_CHAT_ID, adminMessage);
          }
          
          // Add verification buttons for admin
          await bot.sendMessage(ADMIN_CHAT_ID, `Verify payment for ${transactionRef}:`, {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "✅ Approve", callback_data: `approve_${transactionRef}` },
                  { text: "❌ Reject", callback_data: `reject_${transactionRef}` }
                ]
              ]
            }
          });
        } else {
          // Fallback if no admin is set - auto-approve for demo purposes
          setTimeout(() => {
            if ((txnId && txnId.length > 5) || hasPhoto) {
              pendingTransactions[transactionRef].status = 'approved';
              bot.sendMessage(
                chatId,
                `✅ Payment Verified! Thank you for your purchase.\n\n` +
                `📄 Here is your ${pdfKey.charAt(0).toUpperCase() + pdfKey.slice(1)} PDF: ${pdfs[pdfKey]}`
              );
            } else {
              pendingTransactions[transactionRef].status = 'rejected';
              bot.sendMessage(
                chatId,
                "❌ Payment verification failed. Please ensure you've sent a valid transaction ID or payment screenshot.\n\n" +
                "If you've already made the payment, please contact our support."
              );
            }
          }, 5000);
        }
      });
    } catch (error) {
      console.error("Error in payment process:", error);
      bot.sendMessage(
        chatId,
        "Sorry, there was an error processing your request. Please try again later."
      );
    }
  } else if ((data.startsWith("approve_") || data.startsWith("reject_")) && query.message.chat.id.toString() === ADMIN_CHAT_ID) {
    // Handle admin verification responses
    const action = data.split("_")[0];
    const transactionRef = data.split("_")[1];
    
    if (pendingTransactions[transactionRef]) {
      const { chatId, pdfKey } = pendingTransactions[transactionRef];
      
      if (action === "approve") {
        pendingTransactions[transactionRef].status = 'approved';
        
        // Notify user of approval and send PDF
        bot.sendMessage(
          chatId,
          `✅ Payment Verified! Thank you for your purchase.\n\n` +
          `📄 Here is your ${pdfKey.charAt(0).toUpperCase() + pdfKey.slice(1)} PDF: ${pdfs[pdfKey]}`
        );
        
        // Confirm to admin
        bot.sendMessage(ADMIN_CHAT_ID, `✅ Payment for ${transactionRef} has been approved and PDF sent to user.`);
      } else {
        pendingTransactions[transactionRef].status = 'rejected';
        
        // Notify user of rejection
        bot.sendMessage(
          chatId,
          "❌ Your payment could not be verified. Please ensure you've sent the correct amount and transaction details.\n\n" +
          "If you believe this is an error, please contact our support with your reference number."
        );
        
        // Confirm to admin
        bot.sendMessage(ADMIN_CHAT_ID, `❌ Payment for ${transactionRef} has been rejected.`);
      }
    } else {
      bot.sendMessage(ADMIN_CHAT_ID, `⚠️ Transaction reference ${transactionRef} not found or already processed.`);
    }
    
    // Remove the inline keyboard after action
    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: ADMIN_CHAT_ID,
      message_id: query.message.message_id
    });
  }
});

// Handle /admin command for admin dashboard
bot.onText(/\/admin/, (msg) => {
  const chatId = msg.chat.id;
  
  // Only allow access to admin
  if (chatId.toString() === ADMIN_CHAT_ID) {
    // Count transactions by status
    let pending = 0, approved = 0, rejected = 0;
    
    Object.values(pendingTransactions).forEach(tx => {
      if (tx.status === 'pending') pending++;
      else if (tx.status === 'approved') approved++;
      else if (tx.status === 'rejected') rejected++;
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
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log("Bot is running...");
