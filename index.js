const TelegramAPI = require("node-telegram-bot-api");
const buttonOpions = require("./buttonOptions.js");
const token = "6601941655:AAHGcl9LH32eYoNqkt-PJ_a8jnzrjLybPEs";

const bot = new TelegramAPI(token, { polling: true });

const chatData = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "I will tell you a number from 0 to 9, and you must guess this number"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chatData[chatId] = randomNumber;
  await bot.sendMessage(chatId, "let`s go)))", buttonOpions.gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Get Start" },
    { command: "/info", description: "Get Info" },
    { command: "/game", description: "Start game" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      return await bot.sendMessage(chatId, `Well come to test bot chat!`);
    }
    if (text === "/info") {
      return await bot.sendMessage(
        chatId,
        `Your name is: ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return await bot.sendMessage(chatId, "Sorry I don`t understend you");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (data === chatData[chatId]) {
      return await bot.sendMessage(
        chatId,
        `You chose the number: ${data}, and the bot chose ${chatData[chatId]}. Yes, You won!!!`,
        buttonOpions.againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `You chose the number: ${data}, but the bot chose ${chatData[chatId]}. No, it's another number.`,
        buttonOpions.againOptions
      );
    }
  });
};

start();
