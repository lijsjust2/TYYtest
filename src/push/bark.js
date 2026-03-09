const superagent = require("superagent");
require("dotenv").config();

const barkKey = process.env.BARK_KEY || process.env.barkKey;
const barkServer = process.env.BARK_SERVER || process.env.barkServer || "https://api.day.app";
const barkGroup = process.env.BARK_GROUP || process.env.barkgroup || "天翼云盘";

const send = async (title, desp, options = {}) => {
  if (!barkKey) {
    console.log("未配置Bark推送");
    return;
  }

  const group = options.group || barkGroup;
  const icon = options.icon || "https://cloud.dlife.cn/web/main/logo.ico";
  const sound = options.sound || "default";
  const level = options.level || "active";
  const badge = options.badge || 1;
  const url = options.url || "";
  const autoCopy = options.autoCopy || 0;
  const copy = options.copy || "";

  try {
    const encodedTitle = encodeURIComponent(title);
    const encodedDesp = encodeURIComponent(desp);
    const encodedUrl = `${barkServer}/${barkKey}/${encodedTitle}/${encodedDesp}`;
    
    const queryParams = new URLSearchParams({
      group,
      icon,
      sound,
      level,
      badge,
      url,
      autoCopy,
      copy
    });

    const fullUrl = `${encodedUrl}?${queryParams.toString()}`;
    
    const response = await superagent.get(fullUrl);
    
    if (response.body?.code === 200) {
      console.log("Bark推送成功");
    } else {
      console.error(`Bark推送失败: ${JSON.stringify(response.body)}`);
    }
  } catch (error) {
    console.error(`Bark推送失败: ${error.message}`);
  }
};

module.exports = { send };
