const superagent = require("superagent");
require("dotenv").config();

const token = process.env.PUSH_PLUS_TOKEN;

const send = async (title, desp) => {
  if (!token) {
    return;
  }
  const data = {
    token: token,
    title: title,
    content: desp,
  };
  try {
    const res = await superagent
      .post("http://www.pushplus.plus/send/")
      .send(data);
    if (res.body?.code === 200) {
      console.log("pushPlus 推送成功");
    } else {
      console.error(`pushPlus 推送失败:${JSON.stringify(res.body)}`);
    }
  } catch (err) {
    console.error(`pushPlus 推送失败:${JSON.stringify(err)}`);
  }
};

module.exports = { send };
