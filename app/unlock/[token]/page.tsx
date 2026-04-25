import { getAppCloudflareEnv } from '@/lib/cloudflare'
import { redirect, notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function UnlockPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  let articleSlug: string | null = null

  try {
    const env = await getAppCloudflareEnv()
    if (env?.DB) {
      // Find the paid order by token
      const order = await env.DB
        .prepare('SELECT article_id, status FROM orders WHERE id = ?')
        .bind(token)
        .first<{ article_id: string; status: string }>()

      if (order?.status === 'paid') {
        // Get article slug from post id
        const post = await env.DB
          .prepare('SELECT slug FROM posts WHERE id = ?')
          .bind(order.article_id)
          .first<{ slug: string }>()

        if (post?.slug) {
          articleSlug = post.slug
        }
      }
    }
  } catch (err) {
    console.error('Unlock page error:', err)
  }

  if (articleSlug) {
    // Redirect to article page with token parameter
    redirect(`/${articleSlug}?token=${token}`)
  }

  // Invalid or unpaid token
  notFound()
}