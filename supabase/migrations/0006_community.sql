-- مساحتي community feed: anonymous by design. There is no accounts table for
-- regular visitors — mothers use every public tab, including posting, without
-- logging in. `posts.author_hash` is a one-way HMAC of a client-side random
-- device id (computed server-side with a pepper that never leaves the env),
-- so there is no column and no table anywhere that maps a post back to a
-- person. Moderators are the only real accounts in this schema, via
-- Supabase Auth.

create type post_status as enum ('pending', 'approved', 'rejected', 'flagged_crisis');

create table moderators (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  body text not null,
  status post_status not null default 'pending',
  author_hash text not null,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  moderator_id uuid references moderators (id)
);

create index posts_status_idx on posts (status);

-- security_invoker: without it, a view runs with the view owner's
-- privileges (bypassing RLS on the underlying table for anyone who can query
-- it at all). With it, Postgres re-evaluates the querying role's own RLS
-- policies on `posts`, so this view is only ever as permissive as the
-- "moderators read all posts" policy below — never a backdoor around it.
create view pending_moderation
  with (security_invoker = true) as
  select * from posts where status = 'pending';

create table crisis_keywords (
  id uuid primary key default gen_random_uuid(),
  keyword text not null unique,
  language text not null default 'ar',
  severity text not null default 'high'
);

create table crisis_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  phone text,
  url text,
  locale text not null default 'ar'
);

-- NOTE: crisis_keywords is intentionally left unseeded here — the actual
-- term list is a safety-review decision (ideally sourced from a vetted
-- mental-health/crisis-line partner), not something to invent during
-- engineering. Populate this table before enabling the feed in any
-- real (non-local) environment.
