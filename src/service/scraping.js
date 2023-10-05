import { Info } from "../utils/log";

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

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

// scrap 函数使用 Cheerio 库将 HTML 内容加载到 DOM 中，并返回 body 元素的 HTML 内容。
export function scrap(html) {
  const $ = cheerio.load(html);

  // 获取 <body> 标签的内容
  let bodyContent = $('body').html() || '';
  // Info('Body content: ' + bodyContent)
  // 将 bodyContent 转换为 cheerio 对象，以便进行进一步的处理
  const $body = cheerio.load(bodyContent);

  // // 移除所有 <style> 标签及其内容，无论是否有属性
  $body('style').remove();

  // 移除其他不需要的标签及其内容
  $body('script').remove();
  $body('img').remove();
  $body('iframe').remove();
  $body('video').remove();
  $body('svg').remove();
  $body('textarea').remove();
  // // 提取并返回处理后的纯文本内容
  // return $body.text();
  // 移除所有不需要的标签及其内容
  // $body('style, script, img, iframe, video, svg, textarea').remove();

  // 提取处理后的纯文本内容
  let text = $body.text();

  // 去除所有的换行符、制表符和多余的空格
  text = text.replace(/\n|\t/g, ' '); // 替换换行符和制表符为单个空格
  text = text.replace(/\s\s+/g, ' '); // 替换多个空格为单个空格

  // 返回优化后的纯文本内容
  return text.trim(); // 使用 trim() 去除字符串两端的空格
}
