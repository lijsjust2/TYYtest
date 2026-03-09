const superagent = require("superagent");
require("dotenv").config();

const appToken = process.env.WX_PUSHER_APP_TOKEN;
const uid = process.env.WX_PUSHER_UID;

const send = async (title, desp) => {
  if (!(appToken && uid)) {
    return;
  }
  const data = {
    appToken: appToken,
    contentType: 1,
    summary: title,
    content: desp,
    uids: [uid],
  };
  try {
    const res = await superagent
      .post("https://wxpusher.zjiecode.com/api/send/message")
      .send(data);
    if (res.body?.code === 1000) {
      console.log("wxPusher推送成功");
    } else {
      console.error(`wxPusher推送失败:${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    console.error(`wxPusher推送失败:${JSON.stringify(err)}`);
  }
};

module.exports = { send };
