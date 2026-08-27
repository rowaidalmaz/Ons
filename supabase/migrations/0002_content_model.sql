-- تعلّمي (Learn tab): channel/contributor-based content model.
-- Every piece of content has a named author (contributor) and a named
-- channel/show; a channel can mix formats freely, so `format` lives on
-- `content` as an enum rather than as separate tables per format.

create type content_format as enum ('article', 'audio', 'video');
create type tag_category as enum ('age_stage', 'about_her');

create table contributors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table channels (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  format content_format not null,
  body text,
  external_url text,
  duration_label text not null,
  icon text,
  contributor_id uuid not null references contributors (id),
  channel_id uuid not null references channels (id),
  cover_image_url text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index content_published_at_idx on content (published_at desc);

-- 4 age-stage tags + 4 "about her" tags, transcribed verbatim from the
-- prototype's chip strings. "الكل" (all) is the absence of a `tag` filter,
-- not a row in this table.
create table tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label_ar text not null,
  category tag_category not null,
  sort_order int not null
);

create table content_tags (
  content_id uuid not null references content (id) on delete cascade,
  tag_id uuid not null references tags (id) on delete cascade,
  primary key (content_id, tag_id)
);

create index content_tags_tag_id_idx on content_tags (tag_id);

insert into tags (slug, label_ar, category, sort_order) values
  ('age-newborn', 'حديثي الولادة', 'age_stage', 1),
  ('age-early-childhood', 'الطفولة المبكرة', 'age_stage', 2),
  ('age-school', 'المدرسة', 'age_stage', 3),
  ('age-teen', 'المراهقة', 'age_stage', 4),
  ('about-identity', 'هويتك', 'about_her', 5),
  ('about-partnership', 'علاقتك', 'about_her', 6),
  ('about-work', 'شغلك', 'about_her', 7),
  ('about-body-health', 'جسمك وصحتك', 'about_her', 8);
