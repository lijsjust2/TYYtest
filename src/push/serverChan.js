const superagent = require("superagent");
require("dotenv").config();

const sendKey = process.env.SCT_SEND_KEY || process.env.SEND_KEY || process.env.SCTKEY;

const send = async (title, desp) => {
  if (!sendKey) {
    return;
  }
  const data = {
    title,
    desp: desp.replaceAll("\n", "\n\n"),
  };
  try {
    await superagent
      .post(`https://sctapi.ftqq.com/${sendKey}.send`)
      .type("form")
      .send(data);
    console.log("Server酱推送成功");
  } catch (err) {
    if (err.response?.text) {
      const { info } = JSON.parse(err.response.text);
      console.error(`Server酱推送失败:${info}`);
    } else {
      console.error(`Server酱推送失败:${JSON.stringify(err)}`);
    }
  }
};

module.exports = { send };
