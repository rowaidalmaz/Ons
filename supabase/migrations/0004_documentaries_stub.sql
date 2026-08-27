-- وثائقيات (Documentaries tab) — schema seam only. `documentaries` holds the
-- seeded/synced rows the UI renders; `content_source` is bookkeeping for the
-- next-pass YouTube Data API sync job (search terms, cursor/quota state) and
-- is unused by any v1 UI.

create type doc_platform as enum ('youtube', 'netflix', 'bbc', 'independent');

create table documentaries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  original_title text not null,
  description text not null,
  platform doc_platform not null,
  channel_or_studio text not null,
  source_language text not null,
  language_badge text not null,
  duration_label text not null,
  external_url text,
  thumbnail_url text,
  external_id text,
  source_type text not null default 'seed' check (source_type in ('seed', 'youtube_api')),
  created_at timestamptz not null default now()
);

create table content_source (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  search_terms text[],
  last_synced_at timestamptz,
  cursor text,
  config jsonb,
  created_at timestamptz not null default now()
);
