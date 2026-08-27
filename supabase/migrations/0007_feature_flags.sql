-- Feature flags live in the DB (not env vars) so they're flippable without a
-- redeploy — e.g. the community feed should stay hidden until someone is
-- actually staffing the moderation queue day-to-day, and that decision can
-- change at any time.

create table feature_flags (
  key text primary key,
  enabled boolean not null default false,
  description text,
  updated_at timestamptz not null default now(),
  updated_by uuid references moderators (id)
);

insert into feature_flags (key, enabled, description) values
  ('community_feed_public', false, 'مساحتي public feed visibility — off until moderation staffing is confirmed');
