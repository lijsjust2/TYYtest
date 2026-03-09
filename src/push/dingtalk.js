const got = require("got");
const crypto = require("crypto");
require("dotenv").config();

function buildWebhook(token) {
  return token.startsWith("http") ? token : `https://oapi.dingtalk.com/robot/send?access_token=${token}`;
}

function resolveWebhook() {
  const token = process.env.DINGTALK_TOKEN || process.env.dingtalk_token || process.env.TOKEN_FALLBACK;
  const secret = process.env.DINGTALK_SECRET || process.env.dingtalk_secret || process.env.SECRET_FALLBACK;
  if (!token) {
    throw new Error("DingTalk token is missing. Set DINGTALK_TOKEN.");
  }
  const base = buildWebhook(token);
  if (!secret) return base;

  const timestamp = Date.now();
  const stringToSign = `${timestamp}\n${secret}`;
  const sign = crypto
    .createHmac("sha256", secret)
    .update(stringToSign)
    .digest("base64");
  const encodedSign = encodeURIComponent(sign);
  const joiner = base.includes("?") ? "&" : "?";
  return `${base}${joiner}timestamp=${timestamp}&sign=${encodedSign}`;
}

function buildPayload(title, message, msgType) {
  const safeTitle = title || "通知";
  const body = message || "";

  if (msgType === "markdown") {
    const text = title ? `**${title}**\n\n${body}` : body;
    return {
      msgtype: "markdown",
      markdown: {
        title: safeTitle,
        text: text || safeTitle
      }
    };
  }

  return {
    msgtype: "text",
    text: {
      content: title ? `${title}\n${body}` : body
    }
  };
}

async function sendNotify(title, message, options = {}) {
  const webhook = resolveWebhook();
  const format = (options.format || process.env.DINGTALK_MSGTYPE || "markdown").toLowerCase();
  const payload = buildPayload(title, message, format);
  const response = await got.post(webhook, { json: payload, responseType: "json" });
  
  if (response.body.errmsg !== 'ok') {
    throw new Error("DingTalk push fail response: " + response.body.errmsg);
  }
}

module.exports = { sendNotify };
