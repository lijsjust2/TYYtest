const superagent = require("superagent");
require("dotenv").config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const send = async (title, desp) => {
  if (!(botToken && chatId)) {
    return;
  }
  const data = {
    chat_id: chatId,
    text: `${title}\n\n${desp}`,
  };
  try {
    const res = await superagent
      .post(`https://api.telegram.org/bot${botToken}/sendMessage`)
      .type("form")
      .send(data);
    if (res.body?.ok) {
      console.log("TelegramBot推送成功");
    } else {
      console.error(`TelegramBot推送失败:${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    console.error(`TelegramBot推送失败:${JSON.stringify(err)}`);
  }
};

module.exports = { send };
