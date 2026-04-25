import { getStripeServer } from '@/lib/stripe'
import { getAppCloudflareEnv } from '@/lib/cloudflare'
import { getPostBySlug } from '@/lib/db'
import { nanoid } from 'nanoid'
import { jsonError, jsonOk, getRouteContextWithDb } from '@/lib/server/route-helpers'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const route = await getRouteContextWithDb('数据库未配置')
    if (!route.ok) return route.response
    const { env, db } = route

    const body = await req.json()
    const articleSlug = typeof body.articleSlug === 'string' ? body.articleSlug.trim() : ''
    const buyerEmail = typeof body.buyerEmail === 'string' ? body.buyerEmail.trim() : ''
    const agreedRefundPolicy = body.agreedRefundPolicy === true

    if (!articleSlug || !buyerEmail) {
      return jsonError('文章标识和邮箱不能为空', 400)
    }

    // Simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
      return jsonError('邮箱格式不正确', 400)
    }

    if (!agreedRefundPolicy) {
      return jsonError('请先同意退款政策', 400)
    }

    // Fetch article
    const post = await getPostBySlug(db, articleSlug)
    if (!post || post.price_cents <= 0) {
      return jsonError('文章不存在或不是付费文章', 404)
    }

    // Generate unlock token
    const unlockToken = nanoid(32)

    // Create pending order in D1
    await db
      .prepare(
        `INSERT INTO orders (id, stripe_session_id, article_id, buyer_email, amount_cents, currency, status, agreed_refund_policy)
         VALUES (?, '', ?, ?, ?, ?, 'pending', ?)`
      )
      .bind(unlockToken, String(post.id), buyerEmail, post.price_cents, post.currency, agreedRefundPolicy ? 1 : 0)
      .run()

    // Create Stripe Checkout Session
    const stripe = getStripeServer()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const priceDisplay = post.currency === 'USD'
      ? `$${(post.price_cents / 100).toFixed(2)}`
      : `¥${(post.price_cents / 100).toFixed(2)}`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'wechat_pay'],
      line_items: [
        {
          price_data: {
            currency: post.currency === 'USD' ? 'usd' : 'cny',
            product_data: {
              name: post.title,
              description: post.description || undefined,
            },
            unit_amount: post.price_cents,
          },
          quantity: 1,
        },
      ],
      customer_email: buyerEmail,
      metadata: {
        unlock_token: unlockToken,
        article_slug: articleSlug,
        article_id: String(post.id),
      },
      success_url: `${siteUrl}/unlock/${unlockToken}`,
      cancel_url: `${siteUrl}/${articleSlug}`,
      custom_text: {
        submit: {
          message: '电子资料一经购买不支持退款，购买即视为同意退款政策。',
        },
      },
    })

    // Update order with Stripe session ID
    await db
      .prepare('UPDATE orders SET stripe_session_id = ? WHERE id = ?')
      .bind(session.id, unlockToken)
      .run()

    return jsonOk({ url: session.url, token: unlockToken })
  } catch (error) {
    console.error('Checkout error:', error)
    return jsonError('创建支付失败: ' + (error as Error).message, 500)
  }
}
