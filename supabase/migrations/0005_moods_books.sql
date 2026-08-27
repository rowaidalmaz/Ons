-- مساحتي (My Space) — moods drive the generative Web Audio soundscape;
-- `audio_config` is a verbatim port of the prototype's per-mood parameters
-- (noise/filter/gain/arpeggio), not reinvented. Books are a small curated
-- table (never a live external book API) with exactly one Arabic + one
-- English book per mood, both about the mother herself.

create table moods (
  slug text primary key,
  emoji text not null,
  label_ar text not null,
  sort_order int not null,
  track_title_ar text not null,
  track_title_en text not null,
  audio_config jsonb not null
);

create table books (
  id uuid primary key default gen_random_uuid(),
  mood_slug text not null references moods (slug),
  language text not null check (language in ('ar', 'en')),
  title text not null,
  author text not null,
  blurb text not null,
  created_at timestamptz not null default now(),
  unique (mood_slug, language)
);

insert into moods (slug, emoji, label_ar, sort_order, track_title_ar, track_title_en, audio_config) values
  ('tired', '😴', 'متعبة', 1, 'صوت مطر هادئ للاسترخاء', 'Soft Rain for Deep Rest', '{"type":"rain"}'),
  ('sad', '😔', 'حزينة', 2, 'لحظة بيانو دافئة', 'Warm Piano Comfort', '{"type":"pad"}'),
  ('neutral', '😐', 'عادية', 3, 'موسيقى هادئة للتركيز', 'Calm Focus Ambience', '{"type":"air"}'),
  ('happy', '😊', 'مبسوطة', 4, 'لحن بسيط ومنعش', 'Bright Little Melody', '{"type":"arp"}'),
  ('motivated', '💪', 'محفزة', 5, 'إيقاع نشيط وخفيف', 'Light Energetic Beat', '{"type":"arp-fast"}');
