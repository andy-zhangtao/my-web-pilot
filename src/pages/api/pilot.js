const { Info, Error } = require("../../utils/log");
const { search } = require("../../service/search");
import { capture, scrap } from "../../service/scraping";
const { getOpenAIResponse } = require("../../service/gpt");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  Info("Request body: " + JSON.stringify(req.body));

  const { q, engine } = req.body;
  if (!q) {
    return res.status(400).json({ error: "q is required" }); // Bad Request
  }

  let _engine = "bing";
  if (engine) {
    _engine = engine;
  }

  let urls = [];
  try {
    urls = await search(q, _engine, 2);
    Info("handler urls: " + urls);
  } catch (error) {
    Error(error);
    return res.status(500).json({ error: "Internal Server Error" }); // Internal Server Error
  }

  // get the data from urls one by one, if the data can not scrap, then use the next url
  for (let i = 0; i < urls.length; i++) {
    try {
      const data = await capture(urls[i]);
      const body_data = scrap(data);
      Info("Scrap data: " + body_data);
      const response = await getOpenAIResponse(q, body_data);
      Info("handler response: " + response);
      return res.status(200).json({ response });
    } catch (error) {
      Error(error);
      continue;
    }
  }
}
