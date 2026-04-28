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

function baseLogger(label, msg) {
  const now = new Date();
  const formattedTime = now.toLocaleString("zh-TW-u-hc-h23", { timeZone: "Asia/Taipei", hour12: false });
  
  // 統一在這裡處理對齊
  const paddedLabel = `--${label}--`.padEnd(11);
  console.log(`[${formattedTime}] ${paddedLabel} ${msg}`);
}

function msgLogger(msg) {
  baseLogger("normal", msg);
}

function msgDebugger(msg) {
  baseLogger("Debug", msg);
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
