const path = require('path');

function messageExtractor(message) {
  const embed = message.embeds[0] ?? {};

  return {
    title: embed.title ?? 'empty_title',
    desc: embed.description ?? 'empty_description',
    embedAuthor: embed.author?.name ?? 'empty_author',
    footer: embed.footer?.text ?? 'empty_footer',
    image_url: embed.image?.url ?? 'empty_image'
  };
}

function msgLogger(msg) {
  const now = new Date();
  const formattedTime = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei", hour12: false }); // 轉成 "YYYY-MM-DD HH:MM:SS"
  console.log(`[${formattedTime}] --normal-- ${msg}`);
}

function msgDebugger(msg) {
  const now = new Date();
  const formattedTime = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei", hour12: false }); // 轉成 "YYYY-MM-DD HH:MM:SS"
  console.log(`[${formattedTime}] --Debug-- ${msg}`);
}

function cleanText(str) {
  // \u200B 是零寬度空格
  // [^\x20-\x7E] 可以清除大部分非標準 ASCII 的隱形字元
  return str.replace(/[\u200B-\u200D\uFEFF]/g, '');
}

module.exports = { 
  messageExtractor,
  msgLogger,
  msgDebugger,
  cleanText,
};
