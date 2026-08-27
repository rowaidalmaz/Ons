-- Bookmarks ("المحفوظات") — save any reading/watching item and share the list.
--
-- Anonymous by the same design as posts (0006): every bookmark belongs to an
-- `owner_hash` — a server-side HMAC of a client-generated device id, using a
-- pepper that never leaves the env — and to a `collection_id` derived
-- deterministically from that hash. A device therefore always resolves to the
-- same shareable collection without storing anything but its own device id,
-- and the collection uuid is unguessable without the pepper.
--
-- Title/link/emoji are snapshotted onto the row so a shared collection renders
-- without joining back to the three polymorphic source tables (and keeps
-- showing what the saver saw even if the source later changes).

create type bookmark_kind as enum ('content', 'research', 'documentary');

create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null,
  owner_hash text not null,
  kind bookmark_kind not null,
  item_id uuid not null,
  title text not null,
  subtitle text,
  href text,
  emoji text,
  badge text,
  created_at timestamptz not null default now(),
  unique (owner_hash, kind, item_id)
);

create index bookmarks_collection_idx on bookmarks (collection_id, created_at desc);

-- Abuse guard, same shape as posts_rate_limit: 40 saves per device per minute.
create or replace function enforce_bookmark_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (
    select count(*) from bookmarks
    where owner_hash = new.owner_hash
      and created_at > now() - interval '1 minute'
  ) >= 40 then
    raise exception 'rate limit exceeded for this device';
  end if;
  return new;
end;
$$;

create trigger bookmarks_rate_limit
  before insert on bookmarks
  for each row execute function enforce_bookmark_rate_limit();

-- RLS: no public access at all. Every read and write goes through the
-- service-role API route / server components, which prove ownership by
-- re-hashing the raw device id. This keeps the whole table un-enumerable
-- with the anon key, exactly like the crisis_* tables.
alter table bookmarks enable row level security;
