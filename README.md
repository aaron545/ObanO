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

[1.0.3](#v103) | [1.0.2](#v102) | [1.0.1](#v101) | [1.0.0](#v100)

---

## [v1.1.0] - 2026-04-28 <a id="v110"></a>

### 🚀 Added
- **Command Prefix Support**: Implemented `&` as a mandatory prefix for all control commands (e.g., `&start`) to prevent accidental triggers during regular conversation.
- **New `&status` Command**: Added a diagnostic command to display the current state of all toggles (`autowb`, `autowh`, `autoowo`, `hotmode`) with intuitive `[ON] / [OFF]` indicators.

### 🛠 Optimized
- **Refactored Command Logic**:
    - Replaced redundant `if` blocks with an argument-based parser using `split()`, significantly improving code maintainability.
    - Consolidated `start` and `stop` logic into a single streamlined flow using a boolean state toggle.
- **Formatted Logging**:
    - Enhanced `msgLogger` and `msgDebugger` using `padEnd()` to ensure log tags (`--normal--` and `--Debug--`) are perfectly aligned in the console for better readability.

---

## [v1.0.3] - 2026-04-23 <a id="v103"></a>

### 🚀 Added
- **Safety Threshold Debugging**: Added a proactive logging system that triggers when the `count` is within 10 units of the `MAXCOUNT`, allowing for better monitoring of bot activity levels. ⚠️
- **New Auto-Rest Reset Logic**: The bot now automatically triggers a long rest period (20-30 minutes) upon reaching the `MAXCOUNT` threshold.

---

## [v1.0.2] - 2026-04-22 <a id="v102"></a>

### 🛠 Fixed
- **Captcha Logic Fix**: Resolved an issue where the `ban` status was not correctly set to `false` upon detecting a captcha. This ensures the bot properly halts all activities during human verification to prevent detection. 🛡️🛑

---

## [v1.0.1] - 2026-04-20 <a id="v101"></a>

### 🛠 Fixed
- **Time Format Correction**: Fixed an issue where the log timestamp displayed `24:00` at midnight. It now correctly resets to `00:00` using the `h23` hour cycle. ⏰

### ✨ Added
- **New Command Option**: Introduced a new parameter for the ban command: `start ban {option}`. The specific functionality is for you to discover! 🔍🤫

---

## [v1.0.0] - 2026-04-17 <a id="v100"></a>

### Added
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
  You can specify targets like `start ban {option}`

- 📌 **Resource Monitoring**  
  Added a monitor for Gem consumption. If the bot detects you have run out of gems, it will automatically disable relevant functions to prevent useless spamming 💎.
