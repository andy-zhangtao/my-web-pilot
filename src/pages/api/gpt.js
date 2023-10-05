const { Info } = require("../../utils/log");
const { getOpenAIResponse } = require("../../service/gpt");

export default async function handler(req, res) {
  Info("Request method: " + req.method);
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  Info("Request body: " + JSON.stringify(req.body));

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "prompt is required" }); // Bad Request
  }

  try {
    const response = await getOpenAIResponse(q, prompt);
    Info("handler response: " + response);
    return res.status(200).json({ response });
  } catch (error) {
    Error(error);
    return res.status(500).json({ error: "Internal Server Error" }); // Internal Server Error
  }
}
