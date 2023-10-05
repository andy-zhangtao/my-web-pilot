import { capture, scrap } from "../../service/scraping";
const { Info, Error, Debug } = require("../../utils/log"); // 路径应该指向 logger.js 文件的实际位置

export default async function handler(req, res) {
  // 检查请求方法是否为 POST
  Info("Request method: " + req.method);

  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  Info("Request body: " + JSON.stringify(req.body));

  // 从请求体中获取 url 和 lan 参数
  const { url, lan } = req.body;

  // 检查 url 和 lan 是否提供
  if (!url || !lan) {
    return res.status(400).json({ error: "url and lan are required" }); // Bad Request
  }

  try {
    // 调用 service/scraping.js 中的 capture 方法
    const data = await capture(url);
    // Info('Capture data: ' + data)
    const body_data = scrap(data);
    Info("Scrap data: " + body_data);
    return res.status(200).json(body_data); // OK
  } catch (error) {
    //   Error(error);
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" }); // Internal Server Error
  }
}
