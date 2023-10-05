// const searchEngineTool = require("search-engine-tool");
const { Info, Error } = require("../../utils/log"); // 路径应该指向 logger.js 文件的实际位置
const { search } = require("../../service/search");

export default async function handler(req, res) {
  Info("Request method: " + req.method);
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  Info("Request body: " + JSON.stringify(req.body));

  const { q } = req.body;
  if (!q) {
    return res.status(400).json({ error: "q is required" }); // Bad Request
  }

  const engine = "bing";

  try {
    const urls = await search(q, engine, 2);
    Info("handler urls: " + urls);
    return res.status(200).json({ urls });
  } catch (error) {
    Error(error);
    return res.status(500).json({ error: "Internal Server Error" }); // Internal Server Error
  }
}
