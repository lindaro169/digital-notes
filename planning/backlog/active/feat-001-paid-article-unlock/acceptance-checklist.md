# Acceptance Checklist: 付费文章解锁 (feat-001)

## 核心售卖流程

- [ ] 后台可给文章设置价格和交付链接，保存后刷新不丢失
- [ ] 首页/列表只展示付费文章，卡片右上角有价格徽章
- [ ] 付费文章详情页显示 Paywall 区块（价格 + 邮箱 + 退款勾选 + 购买按钮）
- [ ] 未勾选退款政策时购买按钮禁用
- [ ] 点击购买跳转到 Stripe Checkout 收银台
- [ ] Stripe Checkout 页面显示不退款声明
- [ ] 测试卡支付成功后跳回网站
- [ ] 跳回后文章页交付链接已解锁显示
- [ ] 支付成功邮件到达，含解锁链接 + 退款政策 + 订单号
- [ ] 无痕窗口访问同一文章仍显示付费墙
- [ ] D1 orders 表有记录，agreed_refund_policy=1
- [ ] Stripe Dashboard 有对应订单

## 合规功能

- [ ] /privacy 页面可访问
- [ ] /terms 页面可访问
- [ ] /refund-policy 页面可访问，明确声明电子商品不退款
- [ ] 全局 footer 有三个合规链接
- [ ] 首次访问弹出 Cookie 横幅（接受/拒绝）
- [ ] 拒绝后无统计脚本请求
- [ ] 接受后统计脚本正常加载
- [ ] Cookie 同意状态 6 个月过期
- [ ] footer 有"Cookie 偏好设置"可重选

## 统计与 SEO

- [ ] GA4 环境变量配 ID 后，同意 Cookie 可看到请求
- [ ] Clarity 同上
- [ ] Yandex 同上
- [ ] /sitemap.xml 可访问且内容正确
- [ ] /robots.txt 可访问且内容正确
- [ ] <head> 里有 GSC/Bing/Yandex 验证 meta 标签

## 上线后

- [ ] GSC 验证通过 + sitemap 提交成功
- [ ] Bing Webmaster 验证通过 + sitemap 提交成功
- [ ] Yandex 验证通过 + sitemap 提交成功
- [ ] GA4 实时报告有数据
- [ ] Clarity 能看到会话回放
- [ ] 真实卡 1 元小额走通全流程
