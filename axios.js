const axios = require("axios");

const generateText = async text => {
  const request = await axios.post(
    "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Перефразируй этот текст на Украинский: ${text}.`,
          },
        ],
      },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
    }
  );

  console.log("requestrequest", request);

  return request.data.choices[0].message.content;
};

module.exports = generateText;
