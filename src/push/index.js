const dingtalk = require("./dingtalk");
const serverChan = require("./serverChan");
const telegramBot = require("./telegramBot");
const wecomBot = require("./wecomBot");
const wxpush = require("./wxPusher");
const pushPlus = require("./pushPlus");
const bark = require("./bark");

const push = async (title, desp, options = {}) => {
  const promises = [];

  if (process.env.DINGTALK_TOKEN) {
    promises.push(dingtalk.sendNotify(title, desp).catch(err => console.error("钉钉推送失败:", err.message)));
  }

  if (process.env.SCT_SEND_KEY || process.env.SEND_KEY || process.env.SCTKEY) {
    promises.push(serverChan.send(title, desp));
  }

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    promises.push(telegramBot.send(title, desp));
  }

  if (process.env.WECOM_BOT_KEY && process.env.WECOM_BOT_TELPHONE) {
    promises.push(wecomBot.send(title, desp));
  }

  if (process.env.WX_PUSHER_APP_TOKEN && process.env.WX_PUSHER_UID) {
    promises.push(wxpush.send(title, desp));
  }

  if (process.env.PUSH_PLUS_TOKEN) {
    promises.push(pushPlus.send(title, desp));
  }

  if (process.env.BARK_KEY || process.env.barkKey) {
    promises.push(bark.send(title, desp, options));
  }

  if (promises.length === 0) {
    console.log("未配置任何推送方式");
  }

  await Promise.allSettled(promises);
};

module.exports = { push };
