import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendUnlockEmailParams {
  to: string
  articleTitle: string
  articleSlug: string
  unlockUrl: string
  unlockToken: string
  orderId: string
  amount: string
  siteUrl: string
}

export async function sendUnlockEmail({
  to,
  articleTitle,
  articleSlug,
  unlockUrl,
  unlockToken,
  orderId,
  amount,
  siteUrl,
}: SendUnlockEmailParams) {
  const fromEmail = process.env.FROM_EMAIL || 'noreply@yourdomain.com'
  const unlockLink = `${siteUrl}/${articleSlug}?token=${unlockToken}`

  const { error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: `购买确认：${articleTitle}`,
    html: `
      <div style="max-width:560px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;line-height:1.6;">
        <h2 style="font-size:20px;margin-bottom:16px;">购买确认</h2>
        <p>您已成功购买：<strong>${articleTitle}</strong></p>
        <p>支付金额：<strong>${amount}</strong></p>
        <p>订单编号：${orderId}</p>

        <div style="margin:24px 0;padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
          <p style="margin:0 0 8px;font-weight:600;color:#166534;">交付链接</p>
          <a href="${unlockUrl}" target="_blank" style="color:#16a34a;word-break:break-all;">${unlockUrl}</a>
        </div>

        <div style="margin:24px 0;">
          <a href="${unlockLink}" target="_blank" style="display:inline-block;padding:12px 24px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px;font-weight:500;">
            在线查看已购内容
          </a>
        </div>

        <div style="margin:24px 0;padding:12px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;font-size:13px;color:#991b1b;">
          <strong>退款政策：</strong>电子资料一经购买不支持退款。购买时您已确认同意此政策。
        </div>

        <p style="font-size:12px;color:#6b7280;margin-top:24px;">此邮件由系统自动发送，请妥善保存以备后续访问。</p>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send unlock email:', error)
    throw error
  }
}