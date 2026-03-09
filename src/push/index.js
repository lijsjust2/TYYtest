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
    const content = options.dingtalkContent || desp;
    promises.push(dingtalk.sendNotify(title, content).catch(err => console.error("钉钉推送失败:", err.message)));
  }

  if (process.env.SCT_SEND_KEY || process.env.SEND_KEY || process.env.SCTKEY) {
    const content = options.serverChanContent || desp;
    promises.push(serverChan.send(title, content));
  }

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    const content = options.telegramContent || desp;
    promises.push(telegramBot.send(title, content));
  }

  if (process.env.WECOM_BOT_KEY && process.env.WECOM_BOT_TELPHONE) {
    const content = options.wecomContent || desp;
    promises.push(wecomBot.send(title, content));
  }

  if (process.env.WX_PUSHER_APP_TOKEN && process.env.WX_PUSHER_UID) {
    const content = options.wxPusherContent || desp;
    promises.push(wxpush.send(title, content));
  }

  if (process.env.PUSH_PLUS_TOKEN) {
    const content = options.pushPlusContent || desp;
    promises.push(pushPlus.send(title, content));
  }

  if (process.env.BARK_KEY || process.env.barkKey) {
    const content = options.barkContent || desp;
    promises.push(bark.send(title, content, options));
  }

  if (promises.length === 0) {
    console.log("未配置任何推送方式");
  }

  await Promise.allSettled(promises);
};

module.exports = { push };
