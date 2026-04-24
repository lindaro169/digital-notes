-- Migration: add product fields to posts and create orders table

-- 文章表新增付费产品字段
ALTER TABLE posts ADD COLUMN price_cents INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN currency TEXT DEFAULT 'CNY';
ALTER TABLE posts ADD COLUMN unlock_url TEXT;

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  stripe_session_id TEXT UNIQUE,
  article_id TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  agreed_refund_policy INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  paid_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(buyer_email);
CREATE INDEX IF NOT EXISTS idx_orders_article ON orders(article_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
