# 青龙面板部署指南

本文档详细介绍如何在青龙面板中部署天翼云盘自动签到脚本。

---

## 📋 前置要求

- ✅ 青龙面板已安装并正常运行
- ✅ Node.js 版本 18+
- ✅ 网络连接正常

---

## 🚀 快速部署

### 方法一：订阅仓库（推荐）

#### 1. 添加订阅

在青龙面板中，进入 **订阅管理** → **新建订阅**：

```
订阅名称：天翼云盘签到
类型：单文件
链接：https://github.com/lijsjust2/TYYsign.git
定时规则：0 0 5 * * ?
白名单：src/Cloud189.js
```

**说明：**
- **类型**：选择"单文件"，只订阅指定的脚本文件
- **链接**：填写你的 GitHub 仓库地址
- **定时规则**：每天北京时间 5:00 执行
- **白名单**：只订阅 `src/Cloud189.js` 文件

#### 2. 安装依赖

进入 **依赖管理** → **Nodejs** → **添加依赖**，逐个添加以下依赖：

```
chalk
cloud189-sdk
dotenv
got
log4js
p-limit
superagent
```

**注意事项：**
- 依赖名称必须完全一致
- 安装完成后会显示在依赖列表中
- 如果安装失败，请检查网络连接

#### 3. 配置环境变量

进入 **环境变量** → **新建变量**，逐个添加：

| 变量名 | 值 | 备注 | 必需 |
|--------|-----|------|------|
| `TYYS` | `账号1 密码1 账号2 密码2` | 天翼账号密码 | ✅ 是 |
| `BARK_KEY` | `your_bark_key` | Bark设备密钥 | ❌ 否 |
| `BARK_SERVER` | `https://api.day.app` | Bark服务器地址 | ❌ 否 |
| `BARK_GROUP` | `天翼签到` | Bark分组名 | ❌ 否 |

**配置示例：**

```bash
# 必需配置
TYYS="13800138000 password123 13900139000 password456"

# 可选配置（推荐）
BARK_KEY="your_bark_key"
BARK_SERVER="https://api.day.app"
BARK_GROUP="天翼签到"
```

#### 4. 运行脚本

进入 **定时任务** → 找到订阅的任务 → 点击 **运行**

**首次运行建议：**
- 点击 **运行** 按钮
- 查看日志输出
- 确认签到成功
- 检查推送是否正常

---

### 方法二：手动上传文件

#### 1. 上传脚本文件

将以下文件上传到青龙面板的 `scripts` 目录：

```
src/Cloud189.js
src/push/bark.js
src/push/dingtalk.js
src/push/index.js
src/push/pushPlus.js
src/push/serverChan.js
src/push/telegramBot.js
src/push/wecomBot.js
src/push/wxPusher.js
src/logger.js
src/utils.js
```

**上传步骤：**
1. 进入青龙面板的 **脚本管理**
2. 点击 **上传文件**
3. 选择上述文件，批量上传
4. 确认文件上传成功

#### 2. 创建定时任务

进入 **定时任务** → **新建任务**：

```
名称：天翼云盘签到
命令：task src/Cloud189.js
定时规则：0 0 5 * * ?
```

**说明：**
- **命令**：使用 `task` 命令运行脚本
- **定时规则**：Cron 表达式，每天 5:00 执行

#### 3. 安装依赖

同方法一的依赖安装步骤。

#### 4. 配置环境变量

同方法一的环境变量配置步骤。

---

## 🔧 环境变量配置详解

### 必需配置

#### `TYYS` - 账号密码

天翼云盘账号和密码，多个账号用空格分隔。

```bash
# 单个账号
TYYS="13800138000 password123"

# 多个账号（空格分隔）
TYYS="13800138000 password123 13900139000 password456"
```

**注意事项：**
- 账号和密码之间用空格分隔
- 多个账号之间也用空格分隔
- 密码中包含特殊字符时，建议用引号包裹

### 可选配置

#### Bark 推送（推荐）

##### `BARK_KEY` - Bark设备密钥

```bash
BARK_KEY="your_bark_key"
```

**获取方式：**
1. 在 iPhone 上安装 [Bark App](https://apps.apple.com/cn/app/bark-customed-notifications/id1403753865)
2. 打开 App，复制显示的密钥
3. 填入环境变量

##### `BARK_SERVER` - Bark服务器地址

```bash
# 官方服务器（默认，可不配置）
BARK_SERVER="https://api.day.app"

# 自定义服务器
BARK_SERVER="https://api.day.app"
```

**说明：**
- 如果使用官方服务器，可以不配置此变量
- 如果使用自建服务器或第三方服务器，需要配置
- 确保服务器地址可访问

##### `BARK_GROUP` - Bark分组名

```bash
BARK_GROUP="天翼签到"
```

**说明：**
- 默认分组名为"天翼云盘"
- 可以自定义分组名，便于在 Bark App 中分类管理
- 例如：可以设置为"签到任务"、"云盘签到"等

#### 其他推送配置

##### 钉钉推送

```bash
DINGTALK_TOKEN="your_dingtalk_token"
DINGTALK_SECRET="your_dingtalk_secret"
```

##### Server酱推送

```bash
SCT_SEND_KEY="your_serverchan_key"
```

##### Telegram推送

```bash
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
TELEGRAM_CHAT_ID="your_telegram_chat_id"
```

##### 企业微信推送

```bash
WECOM_BOT_KEY="your_wecom_key"
WECOM_BOT_TELPHONE="your_phone_number"
```

##### WxPusher推送

```bash
WX_PUSHER_APP_TOKEN="your_wxpusher_app_token"
WX_PUSHER_UID="your_wxpusher_uid"
```

##### PushPlus推送

```bash
PUSH_PLUS_TOKEN="your_pushplus_token"
```

#### 高级配置

##### `CLOUD189_VERBOSE` - 调试模式

```bash
# 开启详细日志（用于调试）
CLOUD189_VERBOSE=1

# 关闭详细日志（默认）
CLOUD189_VERBOSE=0
```

##### `DINGTALK_MSGTYPE` - 钉钉消息类型

```bash
# Markdown 格式（默认，支持富文本）
DINGTALK_MSGTYPE="markdown"

# 纯文本格式
DINGTALK_MSGTYPE="text"
```

##### `PRIVATE_ONLY_FIRST` - 只签主账号

```bash
# 只签第一个账号
PRIVATE_ONLY_FIRST="true"

# 签到所有账号（默认）
PRIVATE_ONLY_FIRST="false"
```

---

## 📱 推送效果

### Bark 推送示例

配置完成后，签到成功时会收到如下推送：

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

## ⚙️ 高级配置

### 定时规则自定义

默认定时规则为每天 5:00 执行，你可以根据需要修改：

```bash
# 每天早上 6:00
0 0 6 * * ?

# 每天晚上 8:00
0 0 20 * * ?

# 每天中午 12:00
0 0 12 * * ?

# 每隔 6 小时执行一次
0 */6 * * * ?
```

**Cron 表达式说明：**
- 第1位：分钟 (0-59)
- 第2位：小时 (0-23)
- 第3位：日期 (1-31)
- 第4位：月份 (1-12)
- 第5位：星期 (0-6，0 表示周日)

### 日志管理

脚本会自动管理日志：

- 日志文件存储在 `.logs/` 目录
- 单个日志文件最大 10MB
- 保留 3 个备份
- 自动压缩旧日志

无需手动清理日志文件。

---

## 🔍 故障排查

### 问题1：脚本运行失败

**可能原因：**
1. 依赖未安装完整
2. 环境变量未配置
3. 脚本文件未正确上传

**解决方法：**
1. 检查依赖列表，确认所有依赖都已安装
2. 检查环境变量，确认 `TYYS` 已配置
3. 检查脚本文件，确认 `src/Cloud189.js` 存在
4. 查看日志输出，定位具体错误

### 问题2：推送未收到

**可能原因：**
1. 推送环境变量未配置
2. 推送服务的 token/key 不正确
3. 网络连接问题

**解决方法：**
1. 确认推送环境变量已配置
2. 检查推送服务的 token/key 是否正确
3. 确认网络连接正常
4. 查看日志，确认推送是否发送

### 问题3：签到失败

**可能原因：**
1. 账号密码不正确
2. 天翼云盘账号异常
3. 网络连接问题
4. 账号被锁定

**解决方法：**
1. 确认账号密码是否正确
2. 检查天翼云盘账号是否正常
3. 查看错误日志，可能是网络问题
4. 尝试手动登录天翼云盘，确认账号状态

### 问题4：Bark推送未收到

**可能原因：**
1. Bark App 未安装或未开启通知
2. `BARK_KEY` 配置错误
3. `BARK_SERVER` 地址不可访问
4. 网络连接问题

**解决方法：**
1. 确认 Bark App 已安装并允许通知
2. 检查 `BARK_KEY` 是否正确
3. 如果使用自定义服务器，确认 `BARK_SERVER` 地址可访问
4. 查看 Bark App 的推送历史

### 问题5：依赖安装失败

**可能原因：**
1. 青龙面板版本过旧
2. Node.js 版本过低
3. 网络连接问题

**解决方法：**
1. 更新青龙面板到最新版本
2. 确认 Node.js 版本为 18+
3. 检查网络连接
4. 尝试手动安装依赖

---

## 📊 推送方式对比

| 推送方式 | 分组支持 | 图标支持 | 详细内容 | 推荐度 | 适用平台 |
|---------|---------|---------|---------|--------|---------|
| **Bark** | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ | iOS |
| 钉钉 | ❌ | ❌ | ✅ | ⭐⭐⭐⭐ | 全平台 |
| Server酱 | ❌ | ❌ | ✅ | ⭐⭐⭐ | 全平台 |
| Telegram | ❌ | ❌ | ✅ | ⭐⭐⭐⭐ | 全平台 |
| 企业微信 | ❌ | ❌ | ✅ | ⭐⭐⭐⭐ | 全平台 |
| WxPusher | ❌ | ❌ | ✅ | ⭐⭐⭐ | 全平台 |
| PushPlus | ❌ | ❌ | ✅ | ⭐⭐⭐ | 全平台 |

**Bark 推送优势：**
- ✅ 支持分组，便于管理
- ✅ 支持自定义图标
- ✅ 推送及时稳定
- ✅ iOS 原生体验
- ✅ 不消耗设备电量

---

## 📝 注意事项

### 环境变量安全

1. **不要泄露**：不要在公开场合分享包含密码的环境变量
2. **定期更换**：定期更换推送服务的 token
3. **使用 Secrets**：在 GitHub Actions 中使用 Secrets 存储敏感信息

### 依赖管理

1. **确保完整**：确认所有依赖都已安装
2. **定期更新**：定期更新依赖到最新版本
3. **检查版本**：注意依赖版本兼容性

### 定时任务

1. **合理时间**：建议设置在凌晨或早上执行
2. **避免高峰**：避免在高峰时段执行
3. **测试验证**：首次部署后先手动测试

### 推送配置

1. **至少一种**：至少配置一种推送方式
2. **可以多种**：可以同时配置多种推送方式
3. **测试验证**：配置后先测试推送是否正常

---

## 🎯 推荐配置

### 最简配置（Bark推送）

```bash
TYYS="13800138000 password123"
BARK_KEY="your_bark_key"
```

### 完整配置（多种推送）

```bash
TYYS="13800138000 password123 13900139000 password456"
BARK_KEY="your_bark_key"
BARK_SERVER="https://api.day.app"
BARK_GROUP="天翼签到"
DINGTALK_TOKEN="your_dingtalk_token"
SCT_SEND_KEY="your_serverchan_key"
```

### 调试配置

```bash
TYYS="13800138000 password123"
BARK_KEY="your_bark_key"
CLOUD189_VERBOSE=1
```

---

## 📞 技术支持

如果部署过程中遇到问题，请按以下步骤排查：

1. **查看日志**：检查青龙面板的日志输出
2. **检查配置**：确认环境变量和依赖是否正确
3. **查看文档**：
   - [README.md](./README.md) - 项目说明
   - [UPGRADE.md](./UPGRADE.md) - 升级说明
4. **提交问题**：
   - [提交 Issue](https://github.com/lijsjust2/TYYsign/issues)
   - [讨论区](https://github.com/lijsjust2/TYYsign/discussions)

---

## 🎉 部署完成

恭喜你成功部署天翼云盘自动签到脚本！

现在脚本会每天自动签到，并通过你配置的推送方式通知你。

享受自动签到的便利吧！🎊

---

## 📖 相关文档

- [README.md](./README.md) - 项目说明
- [UPGRADE.md](./UPGRADE.md) - 升级说明
- [.env.example](./.env.example) - 环境变量配置模板

---

<div align="center">

**如果觉得有用，请给个 Star ⭐**

Made with ❤️ by lijsjust2

</div>
