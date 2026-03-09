
const log4js = require("log4js");
const fs = require("fs");
const path = require("path");

const logsDir = path.join(process.cwd(), ".logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

log4js.configure({
  appenders: {
    vcr: { type: "recording" },
    out: {
      type: "console",
      layout: {
        type: "pattern",
        pattern: "\u001b[32m%d{yyyy-MM-dd hh:mm:ss}\u001b[0m - %m",
      },
    },
    file: {
      type: "multiFile",
      base: ".logs/",
      property: "categoryName",
      extension: ".log",
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
      layout: {
        type: "pattern",
        pattern: "[账号：%X{user}] %m",
      },
    },
  },
  categories: {
    default: { appenders: ["out", "file"], level: "info" },
    push: { appenders: ["out", "vcr"], level: "info" },
  },
});

const cleanLogs = () => {
  if (!fs.existsSync(logsDir)) {
    return;
  }
  const logs = fs.readdirSync(logsDir);
  logs.forEach(log => {
    if (log.endsWith(".log")) {
      fs.unlinkSync(path.join(logsDir, log));
    }
  });
};

const catLogs = () => {
  if (!fs.existsSync(logsDir)) {
    return "";
  }
  const logs = fs.readdirSync(logsDir);
  const content = logs
    .map((file) => fs.readFileSync(path.join(logsDir, file), { encoding: "utf-8" }))
    .join("\r");
  return content;
};

const logger = log4js.getLogger();

exports.logger = logger;
exports.cleanLogs = cleanLogs;
exports.catLogs = catLogs;