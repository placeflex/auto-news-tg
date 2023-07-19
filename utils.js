const bot = require("./init");

const sendMessageWithButtons = (chatId, text, buttons) => {
  const options = {
    reply_markup: {
      inline_keyboard: buttons,
    },
  };

  bot
    .sendMessage(chatId, text, options)
    .then(() => {
      console.log("Сообщение с кнопками отправлено!");
    })
    .catch(error => {
      console.error("Ошибка при отправке сообщения:", error);
    });
};

module.exports = sendMessageWithButtons;
