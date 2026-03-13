require("dotenv").config();
const { CloudClient, FileTokenStore, logger: sdkLogger } = require("cloud189-sdk");
const pLimit = require("p-limit");
const got = require("got");
const chalk = require("chalk");

const startTime = Date.now();
const tokenDir = ".token";
const timeout = 10000;

const concurrentLimit = parseInt(process.env.CONCURRENT_LIMIT || "3");

sdkLogger.configure({
  isDebugEnabled: process.env.CLOUD189_VERBOSE === "1",
});

// 工具函数
const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const mask = (str, start = 3, end = 7) => {
  if (!str) return str;
  if (str.length <= start + end) return str;
  return str.substring(0, start) + "***" + str.substring(str.length - end);
};

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getIpAddr = async () => {
  try {
    const response = await got("https://api.ipify.org", {
      timeout: { request: 5000 },
    });
    const ip = response.body;
    console.log(chalk.green(`📡 当前IP地址: ${ip}`));
  } catch (error) {
    console.log(chalk.yellow("⚠️  获取IP地址失败，使用默认值"));
  }
};

// 日志函数
const logger = {
  log: (message) => console.log(`[${new Date().toLocaleString()}] ${message}`),
  info: (message) => console.log(`[${new Date().toLocaleString()}] ${chalk.green(message)}`),
  error: (message) => console.log(`[${new Date().toLocaleString()}] ${chalk.red(message)}`),
  addContext: () => {}
};

const cleanLogs = () => {
  // 简化版本，不做实际清理
};

// 推送函数
const push = async (title, desp, options = {}) => {
  const promises = [];

  if (process.env.PUSH_PLUS_TOKEN) {
    const content = options.pushPlusContent || desp;
    promises.push(
      got("http://www.pushplus.plus/send", {
        method: "post",
        json: {
          token: process.env.PUSH_PLUS_TOKEN,
          title,
          content,
          template: "markdown",
        },
      })
    );
  }

  if (process.env.BARK_KEY || process.env.barkKey) {
    const content = options.barkContent || desp;
    const barkKey = process.env.BARK_KEY || process.env.barkKey;
    const barkServer = process.env.BARK_SERVER || process.env.barkServer || "https://api.day.app";
    const group = options.group || process.env.BARK_GROUP || process.env.barkgroup || "天翼云盘";
    const icon = options.icon || "https://cloud.dlife.cn/web/main/logo.ico";
    const sound = options.sound || "default";
    const level = options.level || "active";
    const badge = options.badge || 1;

    const url = `${barkServer}/${barkKey}/${encodeURIComponent(title)}/${encodeURIComponent(content)}?group=${encodeURIComponent(group)}&icon=${encodeURIComponent(icon)}&sound=${sound}&level=${level}&badge=${badge}`;
    promises.push(got(url));
  }

  if (promises.length === 0) {
    console.log("未配置任何推送方式");
  }

  try {
    await Promise.allSettled(promises);
  } catch (e) {
    console.error(`推送失败: ${e.message}`);
  }
};

const recording = {
  erase: () => {}
};

const doUserTask = async (cloudClient, logger) => {
  const personalBonus = [];
  const limit = pLimit(concurrentLimit);

  const promises = [];

  for (let i = 0; i < concurrentLimit; i++) {
    promises.push(limit(async () => {
      try {
        const res = await Promise.race([
          cloudClient.userSign(),
          sleep(timeout).then(() => ({ timedOut: true }))
        ]);
        
        if (!res || res.timedOut) throw new Error(`第${i + 1}次签到超时`);
        
        if (!res.isSign && res.netdiskBonus) {
          personalBonus.push(res.netdiskBonus);
          logger.info(`第${i + 1}次签到: 获得 ${res.netdiskBonus}M 空间`);
        } else if (res.isSign) {
          logger.info(`第${i + 1}次签到: 今日已签到`);
        }
      } catch (e) {
        logger.error(`第${i + 1}次签到失败: ${e.message}`);
      }
    }));
  }

  await Promise.all(promises);

  if (personalBonus.length === 0) personalBonus.push(0);
  return personalBonus;
};

const run = async (userName, password, userSizeInfoMap, logger) => {
  if (userName && password) {
    const before = Date.now();
    try {
      logger.log("开始执行");
      const cloudClient = new CloudClient({
        username: userName,
        password,
        token: new FileTokenStore(`${tokenDir}/${userName}.json`),
      });
      const beforeUserSizeInfo = await cloudClient.getUserSizeInfo();
      userSizeInfoMap.set(userName, {
        cloudClient,
        userSizeInfo: beforeUserSizeInfo,
        logger,
      });
      await doUserTask(cloudClient, logger);
    } catch (e) {
      if (e.response) {
        logger.log(`请求失败: ${e.response.statusCode}, ${e.response.body}`);
      } else {
        logger.error(e);
      }
      if (e.code === "ECONNRESET" || e.code === "ETIMEDOUT") {
        logger.error("请求超时");
        throw e;
      }
    } finally {
      logger.log(
        `执行完毕, 耗时 ${((Date.now() - before) / 1000).toFixed(2)} 秒`
      );
    }
  }
};

const main = async () => {
  if (process.env.TYYStest == null || process.env.TYYStest == "") {
    logger.error("没有设置TYYStest环境变量");
    process.exit(0);
  }

  const userSizeInfoMap = new Map();
  let accounts = process.env.TYYStest.trim().split(/[\n ]+/);
  let totalPersonalSpace = 0;
  let totalFamilySpace = 0;
  let accountDetails = [];

  for (let i = 0; i < accounts.length; i += 2) {
    const [userName, password] = accounts.slice(i, i + 2);
    const userNameInfo = mask(userName, 3, 7);
    const accountIndex = i / 2 + 1;
    const accountLogger = logger;
    accountLogger.addContext("user", userNameInfo);
    
    logger.log(`\n${accountIndex}. 账户 ${userNameInfo} 开始签到`);
    logger.log("  ──────────────────");
    
    await run(userName, password, userSizeInfoMap, accountLogger);
  }

  for (const [
    userName,
    { cloudClient, userSizeInfo, logger },
  ] of userSizeInfoMap) {
    const afterUserSizeInfo = await cloudClient.getUserSizeInfo();
    const personalDeltaM = Math.round(
      (afterUserSizeInfo.cloudCapacityInfo.totalSize -
        userSizeInfo.cloudCapacityInfo.totalSize) /
      1024 /
      1024
    );
    const familyDeltaM = Math.round(
      (afterUserSizeInfo.familyCapacityInfo.totalSize -
        userSizeInfo.familyCapacityInfo.totalSize) /
      1024 /
      1024
    );
    
    totalPersonalSpace += personalDeltaM;
    totalFamilySpace += familyDeltaM;

    const personalTotal = (
      afterUserSizeInfo.cloudCapacityInfo.totalSize /
      1024 /
      1024 /
      1024
    ).toFixed(2);
    const familyTotal = (
      afterUserSizeInfo.familyCapacityInfo.totalSize /
      1024 /
      1024 /
      1024
    ).toFixed(2);
    
    logger.log(
      `  📈 本次增量：个人 ${String(personalDeltaM).padStart(6)}M | 家庭 ${String(familyDeltaM).padStart(6)}M`
    );
    logger.log(
      `  📊 总容量：   个人 ${personalTotal.padStart(8)}G | 家庭 ${familyTotal.padStart(8)}G`
    );

    accountDetails.push({
      userName: mask(userName, 3, 7),
      personalAdd: String(personalDeltaM),
      familyAdd: String(familyDeltaM),
      personalTotal: personalTotal,
      familyTotal: familyTotal
    });
  }

  logger.log("\n" + "=".repeat(45));
  logger.log("📋 所有账户签到完成 - 总计统计");
  logger.log("=".repeat(45));
  logger.log(`  ✅ 合计增量：个人 ${String(totalPersonalSpace).padStart(6)}M | 家庭 ${String(totalFamilySpace).padStart(6)}M`);
  logger.log(`  🔄 并发签到次数：${concurrentLimit}`);
  logger.log("=".repeat(45));

  return { 
    totalPersonalSpace, 
    totalFamilySpace,
    accountDetails 
  };
};

(async () => {
  let taskResult = {
    totalPersonalSpace: 0,
    totalFamilySpace: 0,
    accountDetails: []
  };

  try {
    await getIpAddr();
    taskResult = await main();
    await delay(1000);
  } catch (e) {
    logger.error(`❌ 任务执行异常：${e.message}`);
  } finally {
    const totalAdd = taskResult.totalPersonalSpace + taskResult.totalFamilySpace;
    
    const barkGroup = process.env.BARK_GROUP || process.env.barkgroup || "天翼云盘";
    const barkOptions = {
      group: barkGroup,
      icon: "https://cloud.dlife.cn/web/main/logo.ico",
      sound: "default",
      level: "active",
      badge: 1
    };
    
    const pushTitle = `天翼云盘签到获得${totalAdd}M`;
    
    const summaryContent = `
📢 天翼云盘签到任务完成
${"=".repeat(30)}
✅ 总计增量：
  个人容量 + ${String(taskResult.totalPersonalSpace).padStart(6)}M 
  家庭容量 + ${String(taskResult.totalFamilySpace).padStart(6)}M
  总获得    + ${String(totalAdd).padStart(6)}M
`;

    let fullContent = `
📢 天翼云盘签到任务完成
${"=".repeat(30)}
✅ 总计增量：
  个人容量 + ${String(taskResult.totalPersonalSpace).padStart(6)}M 
  家庭容量 + ${String(taskResult.totalFamilySpace).padStart(6)}M
  总获得    + ${String(totalAdd).padStart(6)}M

📝 账户明细：
${"-".repeat(30)}
`;

    taskResult.accountDetails.forEach((account, index) => {
      fullContent += `
${index + 1}. 账户 ${account.userName}
  📈 本次增量：个人 ${account.personalAdd.padStart(6)}M | 家庭 ${account.familyAdd.padStart(6)}M
  📊 总容量：   个人 ${account.personalTotal.padStart(8)}G | 家庭 ${account.familyTotal.padStart(8)}G
`;
    });

    await push(pushTitle, fullContent, {
      ...barkOptions,
      barkContent: summaryContent,
      pushPlusContent: fullContent
    });
    
    recording.erase();
    cleanLogs();
  }
})();