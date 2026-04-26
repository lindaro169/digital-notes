import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { getAppCloudflareEnv } from '@/lib/cloudflare'
import { getSiteHeaderData } from '@/lib/site'

export const metadata = { title: '隐私政策' }

export default async function PrivacyPage() {
  let headerData: Awaited<ReturnType<typeof getSiteHeaderData>> | undefined
  try {
    const env = await getAppCloudflareEnv()
    if (env?.DB) headerData = await getSiteHeaderData(env.DB)
  } catch {}

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {headerData && <SiteHeader initialTheme={headerData.defaultTheme} navLinks={headerData.navLinks} categories={headerData.categories} stickyOnMobile={false} />}
      <main className="mx-auto max-w-3xl w-full px-4 sm:px-6 flex-1 py-10 sm:py-14">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--editor-ink)] mb-8">隐私政策</h1>
        <div className="prose prose-sm text-[var(--editor-ink)] space-y-4">
          <p><strong>最后更新：</strong>2026年4月24日</p>

          <h2>1. 信息收集</h2>
          <p>我们收集以下信息以提供和改进服务：</p>
          <ul>
            <li><strong>购买信息：</strong>当您购买电子资料时，我们收集您的邮箱地址和支付信息（通过 Stripe 处理，我们不存储信用卡信息）。</li>
            <li><strong>使用数据：</strong>我们使用 Cookie 和类似技术收集网站访问数据，以改善用户体验。</li>
            <li><strong>自动收集的信息：</strong>包括 IP 地址、浏览器类型、访问页面和时间等。</li>
          </ul>

          <h2>2. 信息使用</h2>
          <p>我们使用收集的信息用于：</p>
          <ul>
            <li>处理您的购买并提供交付链接</li>
            <li>发送购买确认邮件</li>
            <li>分析和改善网站性能与用户体验</li>
            <li>遵守法律义务</li>
          </ul>

          <h2>3. 信息共享</h2>
          <p>我们不会出售您的个人信息。我们仅在以下情况下共享信息：</p>
          <ul>
            <li><strong>支付处理：</strong>Stripe 处理您的支付信息，受其自身隐私政策约束。</li>
            <li><strong>邮件服务：</strong>Resend 用于发送购买确认邮件。</li>
            <li><strong>法律要求：</strong>在法律要求或保护我们合法权益时。</li>
          </ul>

          <h2>4. Cookie</h2>
          <p>我们使用 Cookie 用于网站功能和分析。您可以通过浏览器设置或我们的 Cookie 横幅管理 Cookie 偏好。详见我们的 Cookie 政策。</p>

          <h2>5. 数据安全</h2>
          <p>我们采取合理措施保护您的个人信息，但无法保证互联网传输的绝对安全。</p>

          <h2>6. 您的权利</h2>
          <p>根据适用法律，您可能有权访问、更正或删除您的个人信息。如有请求，请通过网站联系方式与我们联系。</p>

          <h2>7. 政策变更</h2>
          <p>我们可能不时更新本政策。重大变更将在网站上通知。</p>

          <h2>8. 联系我们</h2>
          <p>如有关于本隐私政策的问题，请通过网站提供的联系方式与我们联系。</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
