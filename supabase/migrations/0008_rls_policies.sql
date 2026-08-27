-- Row-level security. The community feed's gating is enforced here too, not
-- just by which pages the frontend happens to render, so a client that
-- bypasses the UI still can't read unapproved posts or flip the flag itself.

create or replace function is_moderator()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from moderators where id = auth.uid());
$$;

create or replace function community_feed_is_public()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select enabled from feature_flags where key = 'community_feed_public'), false);
$$;

-- Simple abuse guard: no more than 5 posts per author_hash in a 10-minute window.
create or replace function enforce_post_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (
    select count(*) from posts
    where author_hash = new.author_hash
      and created_at > now() - interval '10 minutes'
  ) >= 5 then
    raise exception 'rate limit exceeded for this device';
  end if;
  return new;
end;
$$;

create trigger posts_rate_limit
  before insert on posts
  for each row execute function enforce_post_rate_limit();

alter table contributors enable row level security;
alter table channels enable row level security;
alter table content enable row level security;
alter table tags enable row level security;
alter table content_tags enable row level security;
alter table research_cache enable row level security;
alter table documentaries enable row level security;
alter table content_source enable row level security;
alter table moods enable row level security;
alter table books enable row level security;
alter table posts enable row level security;
alter table crisis_keywords enable row level security;
alter table crisis_resources enable row level security;
alter table moderators enable row level security;
alter table feature_flags enable row level security;

-- Public read-only content
create policy "public read contributors" on contributors for select using (true);
create policy "public read channels" on channels for select using (true);
create policy "public read content" on content for select using (true);
create policy "public read tags" on tags for select using (true);
create policy "public read content_tags" on content_tags for select using (true);
create policy "public read research_cache" on research_cache for select using (true);
create policy "public read documentaries" on documentaries for select using (true);
create policy "public read moods" on moods for select using (true);
create policy "public read books" on books for select using (true);
create policy "public read feature_flags" on feature_flags for select using (true);

-- Moderator-only writes to content-model tables (managed via Studio/service role for v1;
-- policies exist so authenticated moderators could get an admin UI later without an RLS change).
create policy "moderators write contributors" on contributors for insert with check (is_moderator());
create policy "moderators update contributors" on contributors for update using (is_moderator());
create policy "moderators write channels" on channels for insert with check (is_moderator());
create policy "moderators update channels" on channels for update using (is_moderator());
create policy "moderators write content" on content for insert with check (is_moderator());
create policy "moderators update content" on content for update using (is_moderator());

create policy "moderators write feature_flags" on feature_flags for update using (is_moderator());

-- content_source: internal sync-job bookkeeping only, no public access at all.
create policy "moderators read content_source" on content_source for select using (is_moderator());
create policy "moderators write content_source" on content_source for all using (is_moderator());

-- posts: anyone can submit (rate-limited by trigger above); public can only
-- ever see approved posts, and only while the feature flag is on.
create policy "public insert posts" on posts for insert with check (true);
create policy "public read approved posts" on posts for select
  using (status = 'approved' and community_feed_is_public());
create policy "moderators read all posts" on posts for select using (is_moderator());
create policy "moderators update posts" on posts for update using (is_moderator());

-- moderators, crisis tables: no public access whatsoever.
create policy "moderators read moderators" on moderators for select using (is_moderator());
create policy "moderators read crisis_keywords" on crisis_keywords for select using (is_moderator());
create policy "moderators write crisis_keywords" on crisis_keywords for all using (is_moderator());
create policy "moderators read crisis_resources" on crisis_resources for select using (is_moderator());
create policy "moderators write crisis_resources" on crisis_resources for all using (is_moderator());
