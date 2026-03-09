const superagent = require("superagent");
require("dotenv").config();

const key = process.env.WECOM_BOT_KEY;
const telphone = process.env.WECOM_BOT_TELPHONE;

const send = async (title, desp) => {
  if (!(key && telphone)) {
    return;
  }
  const data = {
    msgtype: "text",
    text: {
      content: `${title}\n\n${desp}`,
      mentioned_mobile_list: [telphone],
    },
  };
  try {
    const res = await superagent
      .post(`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${key}`)
      .send(data);
    if (res.body?.errcode) {
      console.error(`wecomBot推送失败:${JSON.stringify(res.body)}`);
    } else {
      console.log("wecomBot推送成功");
    }
  } catch (err) {
    console.error(`wecomBot推送失败:${JSON.stringify(err)}`);
  }
};

module.exports = { send };
