-- مساحتي daily check-in — one row per device per day. Anonymous by the same
-- design as posts (0006) and bookmarks (0009): the row is keyed by an
-- `owner_hash`, a server-side HMAC of a client-generated device id computed
-- with a pepper that never leaves the env, so nothing maps a check-in back to
-- a person. Re-picking a mood on the same day updates the row in place.
--
-- The trail this feeds ("رجعتِ لنفسك N مرّات") is deliberately a count, never a
-- streak that breaks — missing a day costs nothing.

create table mood_checkins (
  id uuid primary key default gen_random_uuid(),
  owner_hash text not null,
  mood_slug text not null references moods (slug),
  -- the mother's local day. Riyadh is UTC+3 year-round (no DST) and the
  -- audience is Saudi, so a fixed zone keeps "today" stable without trusting
  -- a client clock.
  checked_on date not null default ((now() at time zone 'Asia/Riyadh')::date),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_hash, checked_on)
);

create index mood_checkins_owner_idx on mood_checkins (owner_hash, checked_on desc);

-- Abuse guard, same shape as bookmarks_rate_limit (0009): 60 writes per
-- device per minute. `insert ... on conflict do update` still fires this
-- BEFORE INSERT trigger, so same-day re-picks are covered too.
create or replace function enforce_checkin_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (
    select count(*) from mood_checkins
    where owner_hash = new.owner_hash
      and created_at > now() - interval '1 minute'
  ) >= 60 then
    raise exception 'rate limit exceeded for this device';
  end if;
  return new;
end;
$$;

create trigger mood_checkins_rate_limit
  before insert on mood_checkins
  for each row execute function enforce_checkin_rate_limit();

-- RLS: no public access at all. Every read and write goes through the
-- service-role API route (/api/checkins), which proves ownership by
-- re-hashing the raw device id — the same pattern as bookmarks. This keeps
-- the table un-enumerable with the anon key.
alter table mood_checkins enable row level security;
