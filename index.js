const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const fs = require("fs");

// Replace 'YOUR_BOT_TOKEN' with your Telegram bot token.
const token = process.env.TELEGRAM_TOKEN;

// Create a bot instance.
const bot = new TelegramBot(token, { polling: true });

var userData = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Send a welcome message
  bot.sendMessage(
    chatId,
    "Welcome, this is Amir and Yared!\nTo see your entrance exam result \nPlease provide Your First Name, Middle Name and Last Name\nExample:- Abiy Ahmed Ali."
  );
  userData[chatId] = {};
});

// Set up a listener for incoming messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (userData[chatId]?.name === undefined && messageText !== "/start") {
    // If name is not provided, store the name

    userData[chatId] = {
      name: messageText,
    };
    console.log(userData);

    bot.sendMessage(chatId, "Please enter your admission number:");
  } else if (
    userData[chatId]?.admission === undefined &&
    messageText !== "/start"
  ) {
    // If admission is not provided, store the admission
    userData[chatId].admission = messageText;
    console.log(userData);

    // You can now make the request to the external URL using userData[chatId].name and userData[chatId].admission
    const admission = userData[chatId].admission;
    const name = userData[chatId].name;
    console.log(admission, name);
    const words = name.split(" ");
    const acronym = words
      .map((word) => word[0] + word[1])
      .join("")
      .toUpperCase();
    var reversed =
      acronym[0] +
      acronym[1] +
      acronym[4] +
      acronym[5] +
      acronym[2] +
      acronym[3];

    console.log(reversed);

    const verificationURL = `https://verify.eaes.et/temporary/${reversed}=${admission}`;
    console.log(verificationURL);
    bot.sendMessage(chatId, "loading ...");

    try {
      const response = await axios.get(verificationURL, {
        responseType: "arraybuffer",
      });

      // Handle the response from the verification URL
      const pdfData = response.data;

      // Send the PDF file back to the user
      await bot.sendDocument(chatId, Buffer.from(pdfData), {
        caption: "Exam Result", // Optional: You can add a caption to the document
      });

      userData[chatId] = {};
      bot.sendMessage(
        chatId,
        "Welcome again, !\nTo see your entrance exam result \nPlease provide Your First Name, Middle Name and Last Name\nExample:- Abiy Ahmed Ali."
      );
    } catch (error) {
      // Handle any errors that occur during the HTTP request
      bot.sendMessage(chatId, "Incorrect Name or Admission number.");
      userData[chatId] = {};
      bot.sendMessage(
        chatId,
        "To try again, !\nTo see your entrance exam result \nPlease provide Your First Name, Middle Name and Last Name\nExample:- Abiy Ahmed Ali."
      );
      console.error(error);
    }
  }
});

// Log errors to the console
bot.on("polling_error", (error) => {
  console.error(error);
});

// Log any network errors to the console
bot.on("webhook_error", (error) => {
  console.error(error);
});

bot.on("message", async (msg) => {
  const messageText = msg.text;
  if (messageText === "insult") {
    bot.sendMessage("2071586074", "atiyyuu salami godhami bokkomami");
  }
});
