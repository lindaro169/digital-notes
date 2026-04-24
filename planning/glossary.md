# 术语表

| 术语 | 含义 |
|------|------|
| Paywall | 付费墙，未付款时遮罩锁定交付链接的 UI 区块 |
| unlock_url | 交付链接，付款后展示给买家的外部资源链接（网盘/Notion/Google Drive 等） |
| unlock token | 解锁令牌，支付成功后生成的 UUID，用于识别已购用户 |
| Stripe Checkout | Stripe 托管收银台，处理 Card + WeChat Pay 支付 |
| Resend | 邮件发送服务，用于支付成功后兜底发邮件 |
| D1 | Cloudflare 提供的 SQLite 数据库 |
| R2 | Cloudflare 提供的对象存储（MVP 不用，预留） |
| GDPR | 欧盟数据保护条例，Cookie 横幅需合规 |
| GSC | Google Search Console，搜索引擎站长平台 |
| Clarity | Microsoft 的用户行为分析工具（热力图/回放） |
