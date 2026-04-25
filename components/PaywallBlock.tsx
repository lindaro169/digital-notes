'use client'

import { useState } from 'react'

interface PaywallBlockProps {
  priceCents: number
  currency: string
  articleSlug: string
}

export function PaywallBlock({ priceCents, currency, articleSlug }: PaywallBlockProps) {
  const [email, setEmail] = useState('')
  const [agreedRefundPolicy, setAgreedRefundPolicy] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const priceDisplay = currency === 'USD'
    ? `$${(priceCents / 100).toFixed(2)}`
    : `¥${(priceCents / 100).toFixed(2)}`

  const handlePurchase = async () => {
    if (!email.trim()) {
      setError('请输入邮箱')
      return
    }
    if (!agreedRefundPolicy) {
      setError('请先同意退款政策')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleSlug,
          buyerEmail: email.trim(),
          agreedRefundPolicy: true,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || '创建支付失败')
      }
      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建支付失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-10 rounded-2xl border-2 border-dashed border-[var(--editor-accent)]/30 bg-[var(--editor-panel)]/40 p-6 sm:p-8">
      <div className="text-center mb-6">
        <div className="text-3xl sm:text-4xl font-bold text-[var(--editor-accent)] mb-2">
          {priceDisplay}
        </div>
        <p className="text-sm text-[var(--stone-gray)]">
          购买后可立即查看交付链接，同时发送到您的邮箱
        </p>
      </div>

      <div className="max-w-sm mx-auto space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            placeholder="您的邮箱地址"
            className="w-full rounded-lg border border-[var(--editor-line)] bg-[var(--editor-panel)] px-3 py-2.5 text-sm text-[var(--editor-ink)] outline-none focus:border-[var(--editor-accent)] transition-colors"
          />
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedRefundPolicy}
            onChange={e => { setAgreedRefundPolicy(e.target.checked); setError('') }}
            className="mt-0.5 h-4 w-4 rounded border-[var(--editor-line)] text-[var(--editor-accent)] focus:ring-[var(--editor-accent)]"
          />
          <span className="text-xs text-[var(--stone-gray)] leading-relaxed">
            我已阅读并同意
            <a href="/refund-policy" target="_blank" className="text-[var(--editor-accent)] underline underline-offset-2 hover:text-[var(--editor-accent)]/80">
              退款政策
            </a>
            ：电子资料一经购买不支持退款
          </span>
        </label>

        {error && (
          <p className="text-xs text-rose-600">{error}</p>
        )}

        <button
          onClick={handlePurchase}
          disabled={loading || !agreedRefundPolicy || !email.trim()}
          className="w-full rounded-lg bg-[var(--editor-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--editor-accent)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '正在跳转支付...' : '立即购买'}
        </button>

        <p className="text-center text-[10px] text-[var(--stone-gray)]">
          支持信用卡及微信支付 · 安全由 Stripe 提供
        </p>
      </div>
    </div>
  )
}
