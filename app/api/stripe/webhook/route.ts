import { getStripeServer } from '@/lib/stripe'
import { getAppCloudflareEnv } from '@/lib/cloudflare'
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
    const session = event.data.object as { metadata?: { unlock_token?: string; article_slug?: string } }
    const unlockToken = session.metadata?.unlock_token
    const articleSlug = session.metadata?.article_slug

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

      // TODO: Send email via Resend (T8)
    } catch (err) {
      console.error('Failed to process webhook:', err)
    }
  }

  return jsonOk({ received: true })
}
