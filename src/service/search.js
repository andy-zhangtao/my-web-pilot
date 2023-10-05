const searchEngineTool = require("search-engine-tool");
const { Info, Error } = require("../utils/log"); // 路径应该指向 logger.js 文件的实际位置

export async function search(q, engine, limit) {
  try {
    var urls = [];
    Info("q: " + q);
    const results = await searchEngineTool(q, engine);
    results.forEach((result) => {
      if (urls.length <= limit) {
        urls.push(result.href);
      } else {
        return;
      }
    });

    Info("urls: " + urls);
    return Promise.resolve(urls); // 返回 Promise 对象
  } catch (error) {
    Error(error);
    throw new Error(error.Error); // 抛出异常
  }
}
