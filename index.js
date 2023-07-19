const bot = require("./init");
const generateText = require("./axios");
const axios = require("axios");
const { Telegraf } = require("telegraf");
// const bot = new Telegraf("6178421555:AAH90yAAS7y-BLvTjo-JItdUxrvyhAE2mzI");

let collection = {};

bot.on("text", async ctx => {
  const response = await axios.get(
    `https://api.telegram.org/bot6178421555:AAH90yAAS7y-BLvTjo-JItdUxrvyhAE2mzI/getUpdates`
  );

  let { data } = response;

  let message = data.result;

  let includedCustomTest = message[0]?.message?.text
    ?.toLowerCase()
    ?.includes("custom");

  if (message.length) {
    message.slice(1).map(el => {
      console.log("el", el);
      if (!collection[el.message.message_id]) {
        collection[el.message?.video ? "video" : el.message.message_id] =
          (el.message.photo &&
            el.message?.photo[el.message?.photo?.length - 1].file_id) ||
          el.message?.video.file_id;

        if (el.message.caption) {
          collection["caption"] = includedCustomTest
            ? message[0].message.text.slice(6)
            : el.message.caption.split("\n").slice(0, -2).join(" ");
        }

        if (el.message.reply_markup) {
          collection["reply_markup"] = el.message.reply_markup;
        }

        if (el.message.caption_entities) {
          collection["caption_entities"] = el.message.caption_entities.slice(
            0,
            -2
          );
        }
      }
    });
  }

  let condition = Object.values(collection).filter(
    el => typeof el == "string"
  ).length;

  console.log("collection", collection);

  console.log("condition", condition);
  console.log("message.length", message.length);

  if (condition === message.length) {
    let values = Object.entries(collection)
      .filter(p => {
        return (
          p[0] != "caption" &&
          p[0] != "reply_markup" &&
          p[0] != "caption_entities"
        );
      })
      .map(el => {
        if (el[0] === "video") {
          return {
            type: "video",
            media: el[1],
          };
        } else {
          return {
            type: "photo",
            media: el[1],
          };
        }
      });

    values[values.length - 1] = {
      ...values[values.length - 1],
      caption: collection["caption"] ?? "",
      reply_markup: collection["reply_markup"] ?? "",
      // caption_entities: collection["caption_entities"] ?? "",
    };

    console.log("values", values);

    try {
      // Отправляем sendMediaGroup в другой чат
      // await ctx.replyWithMediaGroup(values, {
      //   caption,
      //   chat_id: -1001973466616,
      // });
      await bot.sendMediaGroup(-1001973466616, values);
      // bot.sendMessage(-1001973466616, "Caption", { photo: values });
    } catch (error) {
      // console.error("Ошибка при отправке sendMediaGroup:", error);
    }

    collection = {};
  }

  // const photos = ctx.update.message.photo;
  // const chatId = ctx.chat.id;
  // const chatHistory = await ctx.telegram.getChatHistory(chatId);
  // console.log("chatHistory", chatHistory);

  // const fileid =
  //   ctx.update.message.photo[ctx.update.message.photo.length - 1].file_id;

  // const fileSize =
  //   ctx.update.message.photo[ctx.update.message.photo.length - 1].file_size;
});

// Запуск бота
// bot
//   .launch()
//   .then(() => {
//     console.log("Бот запущен");
//   })
//   .catch(error => {
//     console.error("Ошибка при запуске бота:", error);
//   });

// const sendMessageWithButtons = require("./utils");

// const buttons = [
//   [{ text: "Кнопка 1", callback_data: "event1" }],
//   [{ text: "Кнопка 2", callback_data: "event2" }],
//   [{ text: "Кнопка 3", callback_data: "event3" }],
// ];

// const options = {
//   reply_markup: {
//     inline_keyboard: buttons,
//   },
// };

// const postsWithPhotos = {};

// bot.on("message", async msg => {
//   const chatId = msg.chat.id;

//   // Проверяем, содержит ли сообщение фотографии
//   const postId = msg.message_id;
//   const photos = msg.photo; // Получаем первые три фотографии

//   console.log("msg.photo", msg.photo);
//   // Получаем информацию о сообщении
//   bot
//     .getMessage(chatId, messageId)
//     .then(message => {
//       const messageOptions = {
//         chat_id: targetChannel,
//         text: message.text,
//         parse_mode: "HTML",
//         reply_markup: message.reply_markup,
//       };

//       // Отправляем сообщение в канал
//       bot
//         .sendMessage(messageOptions.chat_id, messageOptions.text, {
//           parse_mode: messageOptions.parse_mode,
//           reply_markup: messageOptions.reply_markup,
//         })
//         .then(result => {
//           console.log("Пост успешно переслан в канал:", result);
//         })
//         .catch(error => {
//           console.error("Ошибка при пересылке поста:", error);
//         });
//     })
//     .catch(error => {
//       console.error("Ошибка при получении сообщения:", error);
//     });

//   // const photoIds = msg.photo.reduce((uniquePhotos, photo) => {
//   //   // Проверяем, что фотография не была добавлена ранее
//   //   if (!uniquePhotos.some(p => p.media === photo.file_id)) {
//   //     uniquePhotos.push({ type: "photo", media: photo.file_id });
//   //   }
//   //   return uniquePhotos;
//   // }, []);

//   // bot
//   //   .sendMediaGroup(-1001973466616, photoIds)
//   //   .then(result => {
//   //     console.log("Фотографии успешно отправлены:", result);
//   //   })
//   //   .catch(error => {
//   //     console.error("Ошибка при отправке фотографий:", error);
//   //   });

//   // if (!postsWithPhotos[postId]) {
//   //   console.log("FIRST");
//   //   // Если пост с фотографиями еще не обработан, сохраняем информацию о нем
//   //   postsWithPhotos[postId] = {
//   //     chatId,
//   //     photos,
//   //   };

//   //   // Если все три фотографии уже получены, обрабатываем пост
//   //   if (Object.keys(postsWithPhotos[postId].photos).length) {
//   //     console.log("TEST");
//   //     await handlePostWithPhotos(postsWithPhotos[postId]);
//   //     delete postsWithPhotos[postId]; // Удаляем информацию о посте
//   //   }
//   // }

//   // console.log("msg.photo", msg.photo);
//   // const photos = msg.photo.map(pht => {
//   //   // uniquePhotoIds.add(pht.file_id);

//   //   return pht.file_id;
//   //   // return pht.file_id;
//   // });

//   // console.log("photos", photos);

//   // const chatId = msg.chat.id;
//   // const messageId = msg.message_id;
//   // const photo = msg.photo;
//   // const video = msg.video;
//   // let caption = msg.caption;
//   // let resCaption = null;

//   // if (caption && photo) {
//   //   resCaption = await generateText(caption);

//   //   const rs = resCaption?.split("\n\n").slice(0, -1).join("\n\n");

//   //   const largestPhoto = photo[photo.length - 1];
//   //   const fileId = largestPhoto.file_id;

//   //   const photos = photo.map(el => {
//   //     return el.file_id;
//   //   });

//   //   // Отправка фото обратно в чат

//   //   bot.sendMessage(-1001973466616, fileId, rs);

//   //   return;
//   // }
// });

// -1001973466616
