const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot("6178421555:AAH90yAAS7y-BLvTjo-JItdUxrvyhAE2mzI", {
  polling: true,
});

module.exports = bot;
