const { Info, Error } = require("../../utils/log");
const { search } = require("../../service/search");
import { capture, scrap, source_code } from "../../service/scraping";
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
  const retry = 5;
  for (let i = 0; i < retry; i++) {
    try {
      urls = await search(q, _engine, 4);
      if (urls.length == 0) {
        continue;
      }

      Info("handler urls: " + urls);
      break;
    } catch (error) {
      Error(error);
      return res.status(500).json({ error: "Internal Server Error" }); // Internal Server Error
    }
  }

  // get the data from urls one by one, if the data can not scrap, then use the next url
  for (let i = 0; i < urls.length; i++) {
    let url = urls[i];
    // if url start with 'https://www.zhihu.com', then we should use the next url
    // if (url.includes("https://www.zhihu.com")) {
    //   continue; // 使用下一个 URL
    // }

    try {
      // const data = await capture(url);
      const data = await source_code(url);
      Info("-=-=-=-=");
      const body_data = scrap(data);
      Info("Scrap data: " + body_data);
      const response = await getOpenAIResponse(q, body_data);
      Info("handler response: " + response);
      //   if response contains "NO_ANSWER", then it means the response is not valid, so we should use the next url
      if (response.includes("NO_ANSWER")) {
        continue;
      }

      return res.status(200).json({ response, url });
    } catch (error) {
      // Error("-=-=-=", error.Error);
      continue;
    }
  }
  const response = "没有检索到任何有用的资料";
  const url = "";
  return res.status(200).json({ response, url });
}
