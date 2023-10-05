const OpenAIApi = require("openai");
const { Info, Error } = require("../utils/log"); // 路径应该指向 logger.js 文件的实际位置
const util = require("util");

export async function getOpenAIResponse(query, prompt) {
  // get api key from env
  const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // const messages = [
  //   { role: "system", content: "You are a helpful assistant." },
  //   { role: "user", content: "Who won the world series in 2020?" },
  // ];

  let content = util.format(
    'Please understand the following content: "%s". Now use Chinese(as far as possible) answer the question: "%s". If you meet any problem, must reply "NO_ANSWER"',
    prompt,
    query
  );

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. please answer the question base on the provider content",
        },
        { role: "user", content: content },
      ],
      model: "gpt-3.5-turbo-16k",
      max_tokens: 2000,
    });

    console.log(chatCompletion.choices);
    Info("response: " + chatCompletion);
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    Error(error);
    throw new Error(error);
  }
}

// getOpenAIResponse(
//   'Translate the following English text to French: "Hello, how are you?"'
// )
//   .then((response) => console.log(response))
//   .catch((error) => console.error(error));
