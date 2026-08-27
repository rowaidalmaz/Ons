export type ContentFormat = "article" | "audio" | "video";
export type TagCategory = "age_stage" | "about_her";

/** A تعلم section: عنك (about her) or تربيتك (parenting by age stage). */
export type Section = "about" | "parenting";
export type DocPlatform = "youtube" | "netflix" | "bbc" | "independent";
export type PostStatus = "pending" | "approved" | "rejected" | "flagged_crisis";

export interface Contributor {
  id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  slug: string;
  label_ar: string;
  category: TagCategory;
  sort_order: number;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  format: ContentFormat;
  body: string | null;
  external_url: string | null;
  duration_label: string;
  icon: string | null;
  contributor_id: string;
  channel_id: string;
  cover_image_url: string | null;
  published_at: string;
  created_at: string;
}

export interface ContentWithRelations extends Content {
  contributors: Pick<Contributor, "id" | "name">;
  channels: Pick<Channel, "id" | "name">;
  content_tags: { tags: Pick<Tag, "slug"> }[];
}

export interface ResearchCacheRow {
  id: string;
  query_normalized: string;
  query_display: string;
  source: "seed" | "semantic_scholar" | "pubmed";
  source_language: string;
  original_title: string;
  title_ar: string;
  paraphrase_ar: string;
  authors: string | null;
  journal: string | null;
  year: number | null;
  external_url: string;
  created_at: string;
}

export interface DocumentaryRow {
  id: string;
  title: string;
  original_title: string;
  description: string;
  platform: DocPlatform;
  channel_or_studio: string;
  source_language: string;
  language_badge: string;
  duration_label: string;
  external_url: string | null;
  thumbnail_url: string | null;
}

export interface MoodRow {
  slug: string;
  emoji: string;
  label_ar: string;
  sort_order: number;
  track_title_ar: string;
  track_title_en: string;
  audio_config: { type: "rain" | "pad" | "air" | "arp" | "arp-fast" };
}

export interface BookRow {
  id: string;
  mood_slug: string;
  language: "ar" | "en";
  title: string;
  author: string;
  blurb: string;
}

export interface PostRow {
  id: string;
  body: string;
  status: PostStatus;
  author_hash: string;
  created_at: string;
  approved_at: string | null;
}

export interface FeatureFlagRow {
  key: string;
  enabled: boolean;
  description: string | null;
}
