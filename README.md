# 天翼云盘自动签到脚本

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![License](https://img.shields.io/badge/license-ISC-orange.svg)

[![Stars](https://img.shields.io/github/stars/lijsjust2/TYYsign?style=social)](https://github.com/lijsjust2/TYYsign/stargazers)
[![Forks](https://img.shields.io/github/forks/lijsjust2/TYYsign?style=social)](https://github.com/lijsjust2/TYYsign/network/members)

一个功能强大、易于使用的天翼云盘自动签到脚本，支持多种推送方式，适配青龙面板。

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [配置说明](#-配置说明) • [部署指南](#-部署指南) • [常见问题](#-常见问题)

</div>

---

## ✨ 功能特性

- ✅ **自动签到** - 每日自动签到，获取随机空间奖励
- ✅ **多账号支持** - 支持同时签到多个天翼账号
- ✅ **多种推送** - 支持 7 种推送方式（Bark、钉钉、Server酱、Telegram、企业微信、WxPusher、PushPlus）
- ✅ **Bark 分组** - Bark 推送支持自定义分组，便于管理
- ✅ **详细日志** - 完整的日志记录，便于问题排查
- ✅ **Token 管理** - 自动保存登录 Token，避免重复登录
- ✅ **青龙适配** - 完美适配青龙面板
- ✅ **GitHub Actions** - 支持 GitHub Actions 自动运行
- ✅ **容量统计** - 精确显示签到前后容量变化
- ✅ **运行统计** - 显示签到账号数和增加空间

---

## 🚀 快速开始

### 方式一：青龙面板部署（推荐）

1. **添加订阅**

   在青龙面板中，进入 **订阅管理** → **新建订阅**：

   ```bash
   订阅名称：天翼云盘签到
   类型：单文件
   链接：https://github.com/lijsjust2/TYYsign.git
   定时规则：0 0 5 * * ?
   白名单：src/Cloud189.js
   ```

2. **安装依赖**

   进入 **依赖管理** → **Nodejs** → **添加依赖**：

   ```
   chalk
   cloud189-sdk
   dotenv
   got
   log4js
   p-limit
   superagent
   ```

3. **配置环境变量**

   进入 **环境变量** → **新建变量**：

   | 变量名 | 值 | 说明 |
   |--------|-----|------|
   | `TYYStest` | `账号1 密码1 账号2 密码2` | 必需，账号密码 |
   | `BARK_KEY` | `your_bark_key` | 可选，Bark 推送 |
   | `BARK_SERVER` | `https://api.day.app` | 可选，Bark 服务器 |
   | `BARK_GROUP` | `天翼签到` | 可选，Bark 分组名 |

4. **运行脚本**

   进入 **定时任务** → 找到订阅的任务 → 点击 **运行**

### 方式二：本地运行

```bash
# 克隆项目
git clone https://github.com/lijsjust2/TYYsign.git
cd TYYsign

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的配置

# 运行
npm start
```

### 方式三：GitHub Actions

1. **Fork 本仓库** 到你的 GitHub 账号
2. **设置工作流权限**：Settings → Actions → Workflow permissions → Read and write permissions
3. **配置环境变量**：Settings → Secrets and variables → Actions → Repository secrets
4. **手动触发**：Actions → 选择工作流 → Run workflow

---

## 🔧 配置说明

### 必需配置

#### `TYYStest` - 账号密码

天翼云盘账号和密码，多个账号用空格分隔。

```bash
# 单个账号
TYYStest="13800138000 password123"

# 多个账号
TYYStest="13800138000 password123 13900139000 password456"
```

### 推送配置（至少配置一种）

#### Bark 推送（推荐）

iOS 专用推送服务，支持分组和自定义图标。

```bash
BARK_KEY="your_bark_key"
BARK_SERVER="https://api.day.app"
BARK_GROUP="天翼签到"
```

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `BARK_KEY` | Bark 设备密钥 | 必需 |
| `BARK_SERVER` | Bark 服务器地址 | `https://api.day.app` |
| `BARK_GROUP` | Bark 分组名 | `天翼云盘` |

**获取方式：**
1. 在 iPhone 上安装 [Bark App](https://apps.apple.com/cn/app/bark-customed-notifications/id1403753865)
2. 打开 App，复制显示的密钥
3. 填入 `BARK_KEY` 环境变量

#### 钉钉推送

```bash
DINGTALK_TOKEN="your_dingtalk_token"
DINGTALK_SECRET="your_dingtalk_secret"
```

#### Server酱推送

```bash
SCT_SEND_KEY="your_serverchan_key"
```

#### Telegram 推送

```bash
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
TELEGRAM_CHAT_ID="your_telegram_chat_id"
```

#### 企业微信推送

```bash
WECOM_BOT_KEY="your_wecom_key"
WECOM_BOT_TELPHONE="your_phone_number"
```

#### WxPusher 推送

```bash
WX_PUSHER_APP_TOKEN="your_wxpusher_app_token"
WX_PUSHER_UID="your_wxpusher_uid"
```

#### PushPlus 推送

```bash
PUSH_PLUS_TOKEN="your_pushplus_token"
```

### 可选配置

#### `CLOUD189_VERBOSE` - 调试模式

```bash
CLOUD189_VERBOSE=1
```

设置为 `1` 时开启 SDK 详细日志，用于调试问题。

#### `DINGTALK_MSGTYPE` - 钉钉消息类型

```bash
DINGTALK_MSGTYPE="markdown"
```

可选值：`markdown`（默认）或 `text`

#### `PRIVATE_ONLY_FIRST` - 只签主账号

```bash
PRIVATE_ONLY_FIRST="true"
```

设置为 `true` 时，只签第一个账号。

---

## 📱 推送效果

### Bark 推送示例

**标题：** 天翼云盘签到完成

**内容：**
```
签到了 3 个账号，增加了 30.00M 空间

[账号：138***8000] 个人容量：⬆️  10.00M/1024.50G  家庭容量：⬆️  0.00M/512.00G
[账号：139***9000] 个人容量：⬆️  10.00M/2048.00G  家庭容量：⬆️  0.00M/1024.00G
[账号：137***7000] 个人容量：⬆️  10.00M/512.00G  家庭容量：⬆️  0.00M/256.00G

运行时间：3.2s
```

**分组：** 天翼签到

**图标：** 天翼云盘 Logo

---

## 📖 部署指南

### 青龙面板部署

详细的青龙面板部署指南请查看 [QINGLONG.md](./QINGLONG.md)

### GitHub Actions 部署

1. **Fork 本仓库**
2. **设置权限**：Settings → Actions → Workflow permissions → Read and write permissions
3. **配置 Secrets**：Settings → Secrets and variables → Actions → Repository secrets
4. **手动运行**：Actions → 选择工作流 → Run workflow

定时任务：每天北京时间 5:00 自动执行

---

## 🔄 更新日志

### v2.0.0 (2026-03-09)

#### 新增功能
- ✨ 升级到 `cloud189-sdk@1.0.8`，支持最新 API
- ✨ 新增 Bark 推送，支持分组功能
- ✨ 优化推送内容，显示签到账号数和增加空间
- ✨ 增强日志系统，支持文件记录和自动清理
- ✨ 新增 IP 地址自动获取功能

#### 优化改进
- 🎨 优化代码结构，提升可维护性
- 📝 完善文档，添加青龙面板部署指南
- 🔧 改进错误处理，提升稳定性

#### 修复问题
- 🐛 修复 Token 存储相关问题
- 🐛 修复多账号签到时的并发问题

---

## ❓ 常见问题

### Q1: 签到失败怎么办？

**A:** 请检查以下几点：
1. 确认账号密码是否正确
2. 检查天翼云盘账号是否正常
3. 查看错误日志，可能是网络问题或账号被锁定
4. 尝试删除 `.token` 目录下的对应文件，重新登录

### Q2: 推送未收到怎么办？

**A:** 请检查以下几点：
1. 确认推送环境变量是否配置
2. 检查推送服务的 token/key 是否正确
3. 确认网络连接正常
4. 查看 Bark App 的推送历史（如果是 Bark 推送）

### Q3: 如何只签第一个账号？

**A:** 设置环境变量 `PRIVATE_ONLY_FIRST="true"`

### Q4: 如何开启调试模式？

**A:** 设置环境变量 `CLOUD189_VERBOSE=1`

### Q5: 青龙面板依赖安装失败怎么办？

**A:** 请确保以下依赖都已安装：
```
chalk
cloud189-sdk
dotenv
got
log4js
p-limit
superagent
```

### Q6: Bark 推送如何自定义分组？

**A:** 设置环境变量 `BARK_GROUP="你的分组名"`

---

## 📊 推送方式对比

| 推送方式 | 分组支持 | 图标支持 | 详细内容 | 推荐度 |
|---------|---------|---------|---------|--------|
| **Bark** | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| 钉钉 | ❌ | ❌ | ✅ | ⭐⭐⭐⭐ |
| Server酱 | ❌ | ❌ | ✅ | ⭐⭐⭐ |
| Telegram | ❌ | ❌ | ✅ | ⭐⭐⭐⭐ |
| 企业微信 | ❌ | ❌ | ✅ | ⭐⭐⭐ |
| WxPusher | ❌ | ❌ | ✅ | ⭐⭐⭐ |
| PushPlus | ❌ | ❌ | ✅ | ⭐⭐⭐ |

---

## � 项目结构

```
TYYsign/
├── .github/                # GitHub Actions 配置
│   └── workflows/
│       └── start.yml
├── src/                    # 源代码
│   ├── push/              # 推送模块
│   │   ├── bark.js        # Bark 推送
│   │   ├── dingtalk.js    # 钉钉推送
│   │   ├── index.js       # 推送统一入口
│   │   ├── pushPlus.js    # PushPlus 推送
│   │   ├── serverChan.js  # Server酱推送
│   │   ├── telegramBot.js # Telegram 推送
│   │   ├── wecomBot.js   # 企业微信推送
│   │   └── wxPusher.js  # WxPusher 推送
│   ├── Cloud189.js        # 主程序
│   ├── logger.js         # 日志系统
│   ├── utils.js          # 工具函数
│   └── push.js          # 原推送文件（向后兼容）
├── .env.example          # 环境变量配置模板
├── .gitignore           # Git 忽略配置
├── package.json         # 依赖配置
├── README.md           # 项目说明
├── UPGRADE.md         # 升级说明
└── QINGLONG.md        # 青龙面板部署指南
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

本项目采用 [ISC License](./LICENSE) 开源协议。

---

## 🙏 致谢

- [wes-lin/Cloud189Checkin](https://github.com/wes-lin/Cloud189Checkin) - 原项目
- [zhlhlf/drive_checkin](https://github.com/zhlhlf/drive_checkin) - 基础项目
- [cloud189-sdk](https://github.com/wes-lin/cloud189-sdk) - 天翼云盘 SDK

---

## 📞 技术支持

- 📖 [详细文档](./QINGLONG.md)
- 🐛 [提交 Issue](https://github.com/lijsjust2/TYYsign/issues)
- 💬 [讨论区](https://github.com/lijsjust2/TYYsign/discussions)

---

<div align="center">

**如果觉得有用，请给个 Star ⭐**

Made with ❤️ by lijsjust2

</div>
