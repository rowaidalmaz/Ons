import Link from "next/link";
import type { Section, Tag } from "@/lib/supabase/types";

/**
 * Sub-filter chips scoped to a single تعلم section (عنك / تربيتك). `tags`
 * should already be pre-filtered to that section's category — this row just
 * renders "الكل" (reset to the section, no tag) plus one chip per tag.
 */
export function ChipRow({
  tags,
  activeTag,
  section,
  accent,
}: {
  tags: Tag[];
  activeTag?: string;
  section: Section;
  accent?: boolean;
}) {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
      <Chip href={`/?section=${section}`} label="الكل" active={!activeTag} accent={accent} />
      {tags.map((tag) => (
        <Chip
          key={tag.slug}
          href={`/?section=${section}&tag=${tag.slug}`}
          label={tag.label_ar}
          active={activeTag === tag.slug}
          accent={accent}
        />
      ))}
    </div>
  );
}

function Chip({
  href,
  label,
  active,
  accent,
}: {
  href: string;
  label: string;
  active: boolean;
  accent?: boolean;
}) {
  const base =
    "flex-none whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-colors";
  if (active) {
    return (
      <Link
        href={href}
        aria-current="true"
        className={`${base} ${accent ? "bg-gold text-white" : "bg-ink text-white"}`}
      >
        {label}
      </Link>
    );
  }
  return (
    <Link href={href} className={`${base} bg-tint text-ink-soft hover:text-ink`}>
      {label}
    </Link>
  );
}
