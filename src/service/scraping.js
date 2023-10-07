import { Info } from "../utils/log";

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const unirest = require("unirest");

// capture 函数是一个异步函数，它使用 Puppeteer 库启动一个浏览器实例，并在新页面中打开指定的 URL。
// 然后，它等待页面加载完成，收集页面的 HTML 内容，关闭浏览器实例并返回 HTML 内容。
export async function capture(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const html = await page.content();
  await browser.close();
  return html;
}

// source_code 函数使用 source code beautifier 库将 HTML 内容格式化为易于阅读的形式。
// curl 'https://www.codebeautify.com/URLService' \
// -H 'authority: www.codebeautify.com' \
// -H 'accept: */*' \
// -H 'accept-language: en-US,en;q=0.9' \
// -H 'cache-control: no-cache' \
// -H 'content-type: application/x-www-form-urlencoded' \
// -H 'dnt: 1' \
// -H 'origin: https://codebeautify.org' \
// -H 'pragma: no-cache' \
// -H 'referer: https://codebeautify.org/' \
// -H 'sec-ch-ua: "Chromium";v="117", "Not;A=Brand";v="8"' \
// -H 'sec-ch-ua-mobile: ?0' \
// -H 'sec-ch-ua-platform: "macOS"' \
// -H 'sec-fetch-dest: empty' \
// -H 'sec-fetch-mode: cors' \
// -H 'sec-fetch-site: cross-site' \
// -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36' \
// --data-raw 'path=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F617054820' \
// --compressed
// export async function source_code(url) {
//   const body = "path=" + encodeURIComponent(url);
//   // Info("source_code body: " + body);
//   const result = fetch("https://www.codebeautify.com/URLService", {
//     headers: {
//       accept: "*/*",
//       "accept-language": "en-US,en;q=0.9",
//       "cache-control": "no-cache",
//       "content-type": "application/x-www-form-urlencoded",
//       pragma: "no-cache",
//       "sec-ch-ua": '"Chromium";v="117", "Not;A=Brand";v="8"',
//       "sec-ch-ua-mobile": "?0",
//       "sec-ch-ua-platform": '"macOS"',
//       "sec-fetch-dest": "empty",
//       "sec-fetch-mode": "cors",
//       "sec-fetch-site": "cross-site",
//       Referer: "https://codebeautify.org/",
//       "Referrer-Policy": "strict-origin-when-cross-origin",
//     },
//     body: body,
//     method: "POST",
//   });
//   result
//     .then((res) => {
//       if (res.status !== 200) {
//         throw new Error("Failed to fetch source code");
//       }
//       // get the content from the response
//       return res.text();
//     })
//     .then((body) => {
//       // do something with the response body
//       Info(body);
//     })
//     .catch((err) => {
//       Error(err);
//       throw new Error(err.Error); // 抛出异常
//     });
// }

export async function source_code(url) {
  return new Promise((resolve, reject) => {
    const body = "path=" + encodeURIComponent(url);
    var req = unirest("POST", "https://www.codebeautify.com/URLService")
      .headers({
        authority: "www.codebeautify.com",
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        dnt: "1",
        origin: "https://codebeautify.org",
        pragma: "no-cache",
        referer: "https://codebeautify.org/",
        "sec-ch-ua": '"Chromium";v="117", "Not;A=Brand";v="8"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
      })
      .send(`path=${encodeURIComponent(url)}`)
      .end(function (res) {
        if (res.error) throw new Error(res.error);
        // console.log(res.raw_body);
        resolve(res.raw_body);
      });
  });
}

// scrap 函数使用 Cheerio 库将 HTML 内容加载到 DOM 中，并返回 body 元素的 HTML 内容。
export function scrap(html) {
  const $ = cheerio.load(html);

  // 获取 <body> 标签的内容
  let bodyContent = $("body").html() || "";
  // Info('Body content: ' + bodyContent)
  // 将 bodyContent 转换为 cheerio 对象，以便进行进一步的处理
  const $body = cheerio.load(bodyContent);

  // // 移除所有 <style> 标签及其内容，无论是否有属性
  $body("style").remove();

  // 移除其他不需要的标签及其内容
  $body("script").remove();
  $body("img").remove();
  $body("iframe").remove();
  $body("video").remove();
  $body("svg").remove();
  $body("textarea").remove();
  // // 提取并返回处理后的纯文本内容
  // return $body.text();
  // 移除所有不需要的标签及其内容
  // $body('style, script, img, iframe, video, svg, textarea').remove();

  // 提取处理后的纯文本内容
  let text = $body.text();

  // 去除所有的换行符、制表符和多余的空格
  text = text.replace(/\n|\t/g, " "); // 替换换行符和制表符为单个空格
  text = text.replace(/\s\s+/g, " "); // 替换多个空格为单个空格

  // 返回优化后的纯文本内容
  return text.trim(); // 使用 trim() 去除字符串两端的空格
}
