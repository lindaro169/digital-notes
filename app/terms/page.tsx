import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { getAppCloudflareEnv } from '@/lib/cloudflare'
import { getSiteHeaderData } from '@/lib/site'

export const metadata = { title: '服务条款' }

export default async function TermsPage() {
  let headerData: Awaited<ReturnType<typeof getSiteHeaderData>> | undefined
  try {
    const env = await getAppCloudflareEnv()
    if (env?.DB) headerData = await getSiteHeaderData(env.DB)
  } catch {}

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {headerData && <SiteHeader initialTheme={headerData.defaultTheme} navLinks={headerData.navLinks} categories={headerData.categories} stickyOnMobile={false} />}
      <main className="mx-auto max-w-3xl w-full px-4 sm:px-6 flex-1 py-10 sm:py-14">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--editor-ink)] mb-8">服务条款</h1>
        <div className="prose prose-sm text-[var(--editor-ink)] space-y-4">
          <p><strong>最后更新：</strong>2026年4月24日</p>

          <h2>1. 服务说明</h2>
          <p>本网站提供电子资料的在线销售服务。购买完成后，您将获得资料的访问链接。</p>

          <h2>2. 购买与交付</h2>
          <ul>
            <li>购买通过 Stripe 支付平台处理，支持信用卡和微信支付。</li>
            <li>支付成功后，交付链接将在页面上显示，同时发送至您的邮箱。</li>
            <li>您有责任妥善保存交付链接。因个人原因导致链接丢失，我们不保证重新提供。</li>
          </ul>

          <h2>3. 使用限制</h2>
          <ul>
            <li>电子资料仅供个人使用，不得转售、分发或商业使用。</li>
            <li>您不得将交付链接分享给未购买者。</li>
            <li>我们保留因违反使用限制而终止访问的权利。</li>
          </ul>

          <h2>4. 知识产权</h2>
          <p>所有电子资料的知识产权归作者所有。购买仅授予个人使用许可，不转移任何知识产权。</p>

          <h2>5. 免责声明</h2>
          <ul>
            <li>电子资料按"原样"提供，不作任何明示或暗示的保证。</li>
            <li>我们不保证资料内容适用于任何特定目的。</li>
            <li>对于因使用或无法使用资料而造成的任何损失，我们不承担责任。</li>
          </ul>

          <h2>6. 账户与安全</h2>
          <p>本网站不要求注册账户。购买时提供的邮箱仅用于交付和沟通。</p>

          <h2>7. 条款变更</h2>
          <p>我们保留随时修改本条款的权利。继续使用本网站即表示接受修改后的条款。</p>

          <h2>8. 适用法律</h2>
          <p>本条款受网站运营地法律管辖。如有争议，应首先通过协商解决。</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
