import { getStripeServer } from '@/lib/stripe'
import { getAppCloudflareEnv } from '@/lib/cloudflare'
import { sendUnlockEmail } from '@/lib/email'
import { jsonOk } from '@/lib/server/route-helpers'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return new Response(JSON.stringify({ error: 'Missing signature or webhook secret' }), { status: 400 })
  }

  // Verify Stripe webhook signature
  const stripe = getStripeServer()
  let event: ReturnType<typeof stripe.webhooks.constructEvent>
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 })
  }

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      metadata?: { unlock_token?: string; article_slug?: string }
      customer_email?: string
      amount_total?: number
      currency?: string
    }
    const unlockToken = session.metadata?.unlock_token
    const articleSlug = session.metadata?.article_slug
    const buyerEmail = session.customer_email

    if (!unlockToken) {
      console.error('No unlock_token in session metadata')
      return jsonOk({ received: true })
    }

    try {
      const env = await getAppCloudflareEnv()
      if (!env?.DB) {
        console.error('Database not available')
        return jsonOk({ received: true })
      }
      const db = env.DB

      // Update order status to paid
      await db
        .prepare(`UPDATE orders SET status = 'paid', paid_at = strftime('%s', 'now') WHERE id = ? AND status = 'pending'`)
        .bind(unlockToken)
        .run()

      console.log(`Order ${unlockToken} marked as paid for article ${articleSlug}`)

      // Send unlock email via Resend
      if (buyerEmail && articleSlug) {
        try {
          const post = await db
            .prepare('SELECT title, unlock_url, currency FROM posts WHERE slug = ?')
            .bind(articleSlug)
            .first<{ title: string; unlock_url: string | null; currency: string }>()

          if (post?.unlock_url) {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
            const amount = session.currency === 'usd'
              ? `$${((session.amount_total || 0) / 100).toFixed(2)}`
              : `¥${((session.amount_total || 0) / 100).toFixed(2)}`

            await sendUnlockEmail({
              to: buyerEmail,
              articleTitle: post.title,
              articleSlug,
              unlockUrl: post.unlock_url,
              unlockToken,
              orderId: unlockToken,
              amount,
              siteUrl,
            })
            console.log(`Unlock email sent to ${buyerEmail}`)
          }
        } catch (emailErr) {
          // Email failure should not block the webhook response
          console.error('Failed to send unlock email:', emailErr)
        }
      }
    } catch (err) {
      console.error('Failed to process webhook:', err)
    }
  }

  return jsonOk({ received: true })
}
