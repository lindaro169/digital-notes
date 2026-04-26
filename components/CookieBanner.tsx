'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const CONSENT_KEY = 'cookie_consent'
const CONSENT_EXPIRY_MS = 6 * 30 * 24 * 60 * 60 * 1000 // 6 months

type ConsentStatus = 'accepted' | 'rejected' | null

function getStoredConsent(): ConsentStatus {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as { status: ConsentStatus; timestamp: number }
    if (Date.now() - data.timestamp > CONSENT_EXPIRY_MS) {
      localStorage.removeItem(CONSENT_KEY)
      return null
    }
    return data.status
  } catch {
    return null
  }
}

function setConsent(status: ConsentStatus) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CONSENT_KEY, JSON.stringify({ status, timestamp: Date.now() }))
}

export function hasCookieConsent(): boolean {
  return getStoredConsent() === 'accepted'
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = getStoredConsent()
    if (consent === null) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    setConsent('accepted')
    setVisible(false)
    // Reload to load analytics scripts
    window.location.reload()
  }

  const handleReject = () => {
    setConsent('rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--editor-line)] bg-[var(--editor-panel)]/95 backdrop-blur-sm px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-3xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-xs text-[var(--editor-muted)] leading-relaxed flex-1">
          我们使用 Cookie 和类似技术来改善体验和分析网站流量。
          详见<Link href="/privacy" className="text-[var(--editor-accent)] underline underline-offset-2">隐私政策</Link>。
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReject}
            className="rounded-lg border border-[var(--editor-line)] px-3 py-1.5 text-xs font-medium text-[var(--editor-muted)] hover:text-[var(--editor-ink)] hover:border-[var(--editor-ink)] transition-colors"
          >
            拒绝
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-[var(--editor-accent)] px-3 py-1.5 text-xs font-medium text-white hover:brightness-105 transition-all"
          >
            接受
          </button>
        </div>
      </div>
    </div>
  )
}

export function CookiePreferenceReset() {
  const handleReset = () => {
    localStorage.removeItem(CONSENT_KEY)
    window.location.reload()
  }

  return (
    <button
      onClick={handleReset}
      className="text-xs text-[var(--stone-gray)] hover:text-[var(--editor-accent)] underline underline-offset-2 transition-colors"
    >
      Cookie 偏好设置
    </button>
  )
}
