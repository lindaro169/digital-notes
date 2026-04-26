import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { getAppCloudflareEnv } from '@/lib/cloudflare'
import { getSiteHeaderData } from '@/lib/site'

export const metadata = { title: '退款政策' }

export default async function RefundPolicyPage() {
  let headerData: Awaited<ReturnType<typeof getSiteHeaderData>> | undefined
  try {
    const env = await getAppCloudflareEnv()
    if (env?.DB) headerData = await getSiteHeaderData(env.DB)
  } catch {}

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {headerData && <SiteHeader initialTheme={headerData.defaultTheme} navLinks={headerData.navLinks} categories={headerData.categories} stickyOnMobile={false} />}
      <main className="mx-auto max-w-3xl w-full px-4 sm:px-6 flex-1 py-10 sm:py-14">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--editor-ink)] mb-8">退款政策</h1>
        <div className="prose prose-sm text-[var(--editor-ink)] space-y-4">
          <p><strong>最后更新：</strong>2026年4月24日</p>

          <div className="rounded-xl border-2 border-rose-200 bg-rose-50/50 p-4 my-6">
            <p className="font-semibold text-rose-800 mb-2">重要提示</p>
            <p className="text-rose-700">
              本网站销售的均为电子资料（数字商品）。电子资料一经购买并完成交付，<strong>不支持退款</strong>。购买前请确认您需要该资料。
            </p>
          </div>

          <h2>1. 不退款原则</h2>
          <p>由于电子资料的特殊性质——购买后即可立即访问和复制——我们在完成交付后无法回收商品，因此原则上不支持退款。</p>

          <h2>2. 例外情况</h2>
          <p>在以下情况下，我们可能考虑退款：</p>
          <ul>
            <li><strong>未交付：</strong>如果您完成支付但未收到交付链接，且我们确认系统故障导致，将全额退款。</li>
            <li><strong>重复扣款：</strong>因系统错误导致的重复扣款，将退还重复部分。</li>
            <li><strong>法律要求：</strong>在适用法律明确要求退款的情况下。</li>
          </ul>

          <h2>3. 如何申请</h2>
          <p>如遇上述例外情况，请通过网站联系方式提供以下信息：</p>
          <ul>
            <li>订单编号（购买确认邮件中可找到）</li>
            <li>购买时使用的邮箱</li>
            <li>问题描述</li>
          </ul>
          <p>我们将在 3 个工作日内回复您的请求。</p>

          <h2>4. 支付争议</h2>
          <p>如果您通过发卡行发起支付争议（chargeback），我们将根据购买记录和您同意本退款政策的凭证进行回应。购买时您已明确勾选同意本政策，该记录将作为争议处理的依据。</p>

          <h2>5. 政策变更</h2>
          <p>我们保留修改本退款政策的权利。修改后的政策仅适用于修改后产生的购买行为。</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
