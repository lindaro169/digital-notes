# Execution Plan: 付费文章解锁 (feat-001)

## 阶段 A：核心售卖流程

### T1 · 项目初始化
- git clone https://github.com/lindaro169/qiaomu-blog-opensource
- npm install
- cp .env.example .env.local
- npm run dev 跑通首页
- 确认 package.json、wrangler 配置、D1 迁移目录、页面结构
- 验证：浏览器打开 localhost 看到博客首页

### T2 · D1 迁移
- 编写迁移脚本：文章表加 price_cents / currency / unlock_url 三个字段
- 新建 orders 表（id, stripe_session_id, article_id, buyer_email, amount_cents, currency, status, agreed_refund_policy, created_at, paid_at）
- 本地 migrate 成功
- 验证：wrangler d1 execute 查表结构正确

### T3 · 后台字段
- 在文章编辑页组件中加"价格"、"货币"、"解锁链接"三个输入
- 保存逻辑对接 D1
- 验证：后台编辑 → 保存 → 刷新后字段值保留

### T4 · 列表页店铺模式
- 文章列表查询加 WHERE price_cents > 0 过滤
- 卡片组件右上角渲染价格徽章
- 验证：首页只显示付费文章 + 价格标签

### T5 · 文章页 Paywall UI
- 新建 PaywallBlock 组件
- 未付款状态：价格 + 邮箱输入 + 退款政策勾选框 + 购买按钮
- 已付款状态：渲染 unlock_url
- 验证：付费文章显示 paywall；免费文章不显示

### T6 · Stripe Checkout
- 新建 /api/checkout 路由
- 创建 Stripe Checkout Session（payment_method_types: ['card', 'wechat_pay']）
- custom_text 声明不退款
- 前端按钮点击调 API → 跳转 Stripe 收银台
- 验证：测试模式下跳到 Stripe 页面

### T7 · Webhook + 解锁页
- 新建 /api/stripe/webhook 路由，验签 + 写订单
- 生成 unlock token，存入 orders
- 新建 /unlock/[token] 页，校验 token → 写 cookie → 跳回文章页
- 验证：Stripe CLI 触发 webhook → 订单写入 → 解锁页跳转 → 文章页链接显示

### T8 · 邮件兜底
- 集成 Resend SDK
- webhook 处理中支付成功后发邮件：解锁链接 + 退款政策 + 订单编号
- 验证：测试邮件到达，内容正确

## 阶段 B：合规与运营基础

### T9 · 合规页面
- 新建 /privacy、/terms、/refund-policy 三个静态页面
- 全局 footer 加三链接
- 验证：三个页面可访问，footer 链接正确

### T10 · Cookie 横幅
- 新建 CookieBanner 组件（GDPR 同意式：接受/拒绝）
- localStorage 存同意状态（6 个月过期）
- 拒绝后不加载统计脚本
- footer 加"Cookie 偏好设置"入口
- 验证：首次弹出 → 拒绝后无统计请求 → 重新打开偏好可改选

### T11 · 统计集成
- GA4（@next/third-parties/google 的 GoogleAnalytics 组件）
- Clarity（script 注入）
- Yandex Metrica（script 注入）
- 所有脚本依赖 Cookie 同意状态
- 环境变量控制开关（留空不加载）
- 验证：同意后 network 面板看到请求；拒绝后无请求

### T12 · SEO 基础
- src/app/sitemap.ts 自动生成
- src/app/robots.ts 配置
- layout.tsx metadata.verification 配 GSC/Bing/Yandex meta 标签
- 验证：/sitemap.xml 和 /robots.txt 可访问，meta 标签在 head 里

## 阶段 C：上线

### T13 · 部署上线
- 配置生产环境变量（Stripe/Resend/统计 ID/验证码）
- npm run deploy 到 Cloudflare
- Stripe webhook endpoint 指生产域名
- Resend 域名验证
- 真实卡小额测试
- 验证：真实 1 元购买走通全流程

### T14 · 站长平台接入
- GSC 验证 + 提交 sitemap
- Bing Webmaster 同上
- Yandex 同上
- GA4/Clarity 确认数据到达
- 验证：各平台看到站点数据
