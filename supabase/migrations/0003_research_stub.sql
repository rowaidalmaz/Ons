-- ابحث (Search tab) — schema seam only. v1 renders seeded rows regardless of
-- query text; the real Semantic Scholar/PubMed fetch + LLM paraphrase pipeline
-- is next pass. This table shape is what that pipeline will write into.

create table research_cache (
  id uuid primary key default gen_random_uuid(),
  query_normalized text not null,
  query_display text not null,
  source text not null default 'seed' check (source in ('seed', 'semantic_scholar', 'pubmed')),
  source_language text not null,
  original_title text not null,
  title_ar text not null,
  paraphrase_ar text not null,
  authors text,
  journal text,
  year int,
  external_url text not null,
  raw_response jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index research_cache_query_idx on research_cache (query_normalized);
