# ObanO

# How to use this bot

## Config
Edit content of `sampleconfig.json` and rename it as `config.json`.

## Config detail
- **token**: please refer to this [video](https://youtu.be/_4s2DpUhLGQ?si=Y_SXTWQzs9s-n6D8&t=180) to get your Discord token.  
- **guildId**: the guild on which you want the bot to spam.  
- **ownchannelId**: "please use private channel, don't use public channel."

---

## 📜 Changelog

### 🔗 Versions

[1.0.1](#v101) | [1.0.0](#v100)

---

## [v1.0.1] - 2026-04-20 <a id="v101"></a>

### 🛠 Fixed
- **Time Format Correction**: Fixed an issue where the log timestamp displayed `24:00` at midnight. It now correctly resets to `00:00` using the `h23` hour cycle. ⏰

### ✨ Added
- **New Command Option**: Introduced a new parameter for the ban command: `start ban {option}`. The specific functionality is for you to discover! 🔍🤫

---

### [v1.0.0] - 2026-04-17 <a id="v100"></a>

#### Added
- 📌 **Auto WB & WH Loop**  
  Implemented a core loop that automatically sends "wb" and "wh" commands to your designated channel 🔄.  
  Includes `randomDelay` logic to ensure human-like behavior and bypass basic detection 🛡️.

- 📌 **Smart Time Management (Rest System)**  
  Added two layers of resting:  
  1. **Fixed Rest Schedule**: Automatically enters sleep mode daily from specific time 🌙.  
  2. **Random Rest**: Occurs based on a configurable probability (`restprob`) to simulate natural user fatigue 💤.

- 📌 **Advanced Safety & Captcha Detection**  
  The bot now intelligently monitors messages for human verification requests ⚠️.  
  If a **Captcha** or "real human" check is detected, the bot will stop 🔥.

- 📌 **Dynamic Command Control**  
  Introduced `start ban` and `stop ban` commands to control the bot in real-time 🎮.  
  You can specify targets like `start ban wb` or `stop ban wh`, or use the commands alone to toggle everything at once.

- 📌 **Resource Monitoring**  
  Added a monitor for Cowoncy consumption. If the bot detects you have run out of currency (e.g., "spent 5 cowoncy" fail), it will automatically disable relevant functions to prevent useless spamming 💎.
