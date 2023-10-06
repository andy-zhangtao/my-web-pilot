const searchEngineTool = require("search-engine-tool");
const { Info, Error } = require("../utils/log"); // 路径应该指向 logger.js 文件的实际位置
var unirest = require("unirest");

function googleSearchEngine(key, engine_id, q) {
  return new Promise((resolve, reject) => {
    var req = unirest(
      "GET",
      `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${engine_id}&q=${encodeURIComponent(
        q
      )}`
    ).end(function (res) {
      if (res.error) {
        reject(new Error(res.error));
      } else {
        const body = JSON.parse(res.raw_body);
        if (
          body.queries &&
          body.queries.request &&
          body.queries.request[0].count > 0
        ) {
          let links = [];
          body.items.map((item) => {
            Info(item.link);
            links.push(item.link);
          });
          resolve(links);
        } else {
          resolve([]);
        }
      }
    });
  });
}

export async function search(q, engine, limit) {
  try {
    var urls = [];
    Info("[search] q: " + q);
    // const results = await searchEngineTool(q, engine);
    const results = await googleSearchEngine(
      process.env.GOOGLE_API_KEY,
      process.env.GOOGLE_ENGINE_ID,
      q
    );
    // results.forEach((result) => {
    //   if (urls.length <= limit) {
    //     urls.push(result.href);
    //   } else {
    //     return;
    //   }
    // });

    // Info("[search] urls: " + urls);
    return Promise.resolve(results); // 返回 Promise 对象
  } catch (error) {
    Error(error);
    throw new Error(error.Error); // 抛出异常
  }
}
