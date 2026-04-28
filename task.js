const helper = require('./helper');
const { ownchannelId } = require('./config.json');

let autowb = true;
let autowh = true;
let autoowo = false;
let count = 0;
let hotmode = false;

const MAXCOUNT = 200;

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
      count += 1;

      if (count > MAXCOUNT-10) {
        helper.msgDebugger(`count = ${count}`);
      }

      await safeSend(channel, "wb");
      await randomDelay(1, 0.2);
    }

    if (autowh) {
      await safeSend(channel, "wh");
      await randomDelay(1, 0.2);
    }

    if (hotmode) {
      await randomDelay(18, 2);
    } else {
      await randomDelay(27, 9);

      if (restCheck(restprob)) {
        helper.msgLogger("🕖 Trigger rest by random, zzz...... 🕖")
        count = 0;
        await randomDelay(900, 300); // 10-20分鐘
      } else if (count >= MAXCOUNT) {
        helper.msgLogger("🕖 Trigger rest by count, zzz...... 🕖")
        count = 0;
        await randomDelay(1500, 300); // 20-30分鐘
      }
    }
    
  }
}

async function checkMessageCreate(message, client){
  const { title, desc, embedAuthor, footer, image_url } = helper.messageExtractor(message);
  const mentionUser = `<@${client.user.id}>`;
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const channel = client.channels.cache.get(ownchannelId);

  if (embedAuthor.includes(client.user.globalName) && embedAuthor.includes("goes into battle!") && message.author.username == "OwO") {
    helper.msgLogger(footer);
  }

  // 確保是本人發出且以 & 開頭
  if (message.author.username === client.user.username && message.content.startsWith('&')) {
    
    // 1. 去除前綴並清洗文字
    const cleanContent = helper.cleanText(message.content.slice(1)); 
    const parts = cleanContent.split(/\s+/); // 分割成陣列
    
    const action = parts[0]; // start, stop, 或其他
    const target = parts[1]; // ban, hotmode
    const subTarget = parts[2]; // wb, wh, owo

    // --- 處理 &status 指令 ---
    if (action === "status") {
      const getStatus = (val) => val ? "[ON]" : "[OFF]"; // 輔助小函數

      const statusMsg = [
        `Current Settings:`,
        ` - autowb:   ${getStatus(autowb)}`,
        ` - autowh:   ${getStatus(autowh)}`,
        ` - autoowo:  ${getStatus(autoowo)}`,
        ` - hotmode:  ${getStatus(hotmode)}`
      ].join('\n');

      helper.msgLogger(statusMsg);
      await safeSend(channel, statusMsg);
      return; // 執行完 status 就結束，不跑下面的邏輯
    }

    // --- 處理 &start/stop 指令 ---
    if (action === "start" || action === "stop") {
      const isEnable = action === "start";
      
      // 處理 hotmode: &start hotmode
      if (target === "hotmode") {
        hotmode = isEnable;
        helper.msgLogger(`set hotmode = ${hotmode}`);
      }

      // 處理 ban 相關: &start ban [subTarget]
      if (target === "ban") {
        let hasMatched = false;
        
        if (subTarget) {
          if (subTarget.includes("wb")) { autowb = isEnable; hasMatched = true; }
          if (subTarget.includes("wh")) { autowh = isEnable; hasMatched = true; }
          if (subTarget.includes("owo")) { 
            autoowo = isEnable; 
            hasMatched = true;
            helper.msgLogger(`set autoowo = ${autoowo}`);
          }
        }

        // 如果只有輸入 &start ban (沒指定 wb/wh/owo)，預設處理 wb 和 wh
        if (!hasMatched) {
          autowb = isEnable;
          autowh = isEnable;
        }

        helper.msgLogger(`set autowb = ${autowb}`);
        helper.msgLogger(`set autowh = ${autowh}`);
      }
    }
  }

  if (helper.cleanText(message.content).includes("spent 5 <:cowoncy:416043450337853441>")) {
    helper.msgLogger("Run out of 💎");
    autowh = false;
    helper.msgLogger(`set autowh = ${autowh}`);
  }

  if (helper.cleanText(message.content).includes("are you a real human") || helper.cleanText(message.content).includes("verify that you are human")) {
    helper.msgLogger("🔥🔥🔥🔥🔥🔥🔥 There is a captcha 🔥🔥🔥🔥🔥🔥🔥");
    helper.msgLogger("🔥🔥🔥🔥🔥🔥🔥 There is a captcha 🔥🔥🔥🔥🔥🔥🔥");
    helper.msgLogger("🔥🔥🔥🔥🔥🔥🔥 There is a captcha 🔥🔥🔥🔥🔥🔥🔥");
    helper.msgLogger("🔥🔥🔥🔥🔥🔥🔥 There is a captcha 🔥🔥🔥🔥🔥🔥🔥");
    helper.msgLogger("🔥🔥🔥🔥🔥🔥🔥 There is a captcha 🔥🔥🔥🔥🔥🔥🔥");
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
