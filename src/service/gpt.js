const OpenAIApi = require("openai");
const { Info, Error } = require("../utils/log"); // 路径应该指向 logger.js 文件的实际位置

export async function getOpenAIResponse(prompt) {
  // get api key from env
  const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Who won the world series in 2020?" },
  ];

  try {
    Info("openai: === ", openai);
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Say this is a test" }],
      model: "gpt-3.5-turbo",
    });

    console.log(chatCompletion.choices);
    Info("response: " + response);
    return response.choices[0].message.content;
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
