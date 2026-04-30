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

function formatFooter(footer) {
  const parts = footer.split('|').map(p => p.trim());
  
  // 第一段：遊戲結果 (左對齊)
  const result = parts[0].padEnd(25);
  
  // 第二段：XP (左對齊數字部分)
  const xp = parts[1].padEnd(10);
  
  // 第三段：Streak (左對齊標籤)
  const streak = parts[2]; 

  return `${result} | ${xp} | ${streak}`;
}

module.exports = { 
  messageExtractor,
  msgLogger,
  msgDebugger,
  cleanText,
  formatFooter,
};
