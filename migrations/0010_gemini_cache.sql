-- Migration: Add Gemini API Cache
-- Description: Caches Gemini API responses to reduce latency and costs
-- Created: 2024-05-22

CREATE TABLE IF NOT EXISTS gemini_cache (
  id TEXT PRIMARY KEY,
  hash TEXT NOT NULL,
  prompt TEXT,
  response TEXT NOT NULL, -- JSON
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_gemini_cache_hash ON gemini_cache(hash);
