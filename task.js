const helper = require('./helper');
const { ownchannelId } = require('./config.json');

let autowb = true;
let autowh = true;
let autoowo = false;

let restprob = 5;

function randomDelay(base, bias = 0) {
  const time = base + bias * (Math.random() * 2 - 1);
  if (time >= 100) {
    helper.msgDebugger(`sleep time = ${time} sec`);
  }
  return new Promise(resolve => setTimeout(resolve, time*1000));
}

function restCheck(prob) {
  const rest = Math.random() * 1000;
  if (rest <= prob) {
    helper.msgDebugger(`rest = ${rest}`);
  }
    return rest <= prob;
}

function isRestTime() {
  const now = new Date();
  const options = { timeZone: "Asia/Taipei", hour: 'numeric', minute: 'numeric', hour12: false };
  const formatter = new Intl.DateTimeFormat('zh-TW', options);
  const parts = formatter.formatToParts(now);

  const hour = parseInt(parts.find(p => p.type === 'hour').value);
  const minute = parseInt(parts.find(p => p.type === 'minute').value);

  const totalMinutes = hour * 60 + minute;
  const startTime = 1 * 60;    // 01:00
  const endTime = 7 * 60 + 30; // 07:30

  return totalMinutes >= startTime && totalMinutes <= endTime;
}

function safeSend(channel, content) {
  return channel.send(content).catch(err => {
    helper.msgLogger(`❌ Failed to send "${content}" to channel ${channel.id}:`);
    helper.msgLogger(err);
  });
}

async function startAutoCatch(client) {
  const channel = client.channels.cache.get(ownchannelId);
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  while (true) {
    if (isRestTime()) {
      helper.msgLogger("🌙 現在是固定休息時間 (01:00 - 07:30)，暫停運作中... 🌙");
      autowb = false;
      autowh = false;
      helper.msgLogger(`set autowb = ${autowb}`);
      helper.msgLogger(`set autowh = ${autowh}`);
      await delay(600000); // 每十分鐘 (600,000ms) 檢查一次是否還在休息時段
      continue;
    }
    if (autoowo) {
      await safeSend(channel, "owo");
      await randomDelay(1, 0.2);
    }

    if (autowb) {
      await safeSend(channel, "wb");
      await randomDelay(1, 0.2);
    }

    if (autowh) {
      await safeSend(channel, "wh");
      await randomDelay(1, 0.2);
    }
    await randomDelay(27, 9);

    if (restCheck(restprob)) {
      helper.msgLogger("🕖 Trigger random rest, zzz...... 🕖")
      await randomDelay(900, 300); // 10-20分鐘
    }
  }
}

async function checkMessageCreate(message, client){
  const { title, desc, embedAuthor, footer, image_url } = helper.messageExtractor(message);
  const mentionUser = `<@${client.user.id}>`;
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  if (embedAuthor.includes(client.user.globalName) && embedAuthor.includes("goes into battle!") && message.author.username == "OwO") {
    helper.msgLogger(footer);
  }

  if (message.content.startsWith("start ban") && message.author.username == client.user.username ) {
    let hasMatched = false;
    if (helper.cleanText(message.content).includes("wb")) {
      autowb = true;
      hasMatched = true;
    }
    if (helper.cleanText(message.content).includes("wh")) {
      autowh = true;
      hasMatched = true;
    }
    if (helper.cleanText(message.content).includes("owo")) {
      autoowo = true;
      hasMatched = true;
      helper.msgLogger(`set autoowo = ${autoowo}`);
    }
    if (!hasMatched) {
      autowb = true;
      autowh = true;
    }
    helper.msgLogger(`set autowb = ${autowb}`);
    helper.msgLogger(`set autowh = ${autowh}`);
  }

  if (helper.cleanText(message.content).includes("stop ban") && message.author.username == client.user.username ) {
    let hasMatched = false;
    if (helper.cleanText(message.content).includes("wb")) {
      autowb = false;
      hasMatched = true;
    }
    if (helper.cleanText(message.content).includes("wh")) {
      autowh = false;
      hasMatched = true;
    }
    if (helper.cleanText(message.content).includes("owo")) {
      autoowo = false;
      hasMatched = true;
      helper.msgLogger(`set autoowo = ${autoowo}`);
    }
    if (!hasMatched) {
      autowb = false;
      autowh = false;
    }
    helper.msgLogger(`set autowb = ${autowb}`);
    helper.msgLogger(`set autowh = ${autowh}`);
  }

  if (helper.cleanText(message.content).includes("spent 5 <:cowoncy:416043450337853441>")) {
    helper.msgLogger("Run out of 💎");
    autowh = false;
    helper.msgLogger(`set autowh = ${autowh}`);
  }

  if (helper.cleanText(message.content).includes("are you a real human") || helper.cleanText(message.content).includes("verify that you are human")) {
    helper.msgLogger("🔥🔥🔥 There is a captcha 🔥🔥🔥");
    autowb = false;
    autowh = false;
    autoowo = false;
    helper.msgLogger(`set autowb = ${autowb}`);
    helper.msgLogger(`set autowh = ${autowh}`);
    helper.msgLogger(`set autoowo = ${autoowo}`);
  }

}

async function checkMessageUpdate(message, client){
  const { title, desc, embedAuthor, footer, image_url } = helper.messageExtractor(message);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { 
  checkMessageCreate, 
  checkMessageUpdate, 
  safeSend, 
  startAutoCatch,
};
