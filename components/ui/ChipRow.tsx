import Link from "next/link";
import type { Tag } from "@/lib/supabase/types";

export function ChipRow({ tags, activeTag }: { tags: Tag[]; activeTag?: string }) {
  return (
    <div className="mb-1.5 flex gap-2 overflow-x-auto pb-3.5">
      <Chip href="/" label="الكل" active={!activeTag} />
      {tags.map((tag) => (
        <Chip
          key={tag.slug}
          href={`/?tag=${tag.slug}`}
          label={tag.category === "about_her" ? `✦ ${tag.label_ar}` : tag.label_ar}
          active={activeTag === tag.slug}
          self={tag.category === "about_her"}
        />
      ))}
    </div>
  );
}

function Chip({
  href,
  label,
  active,
  self,
}: {
  href: string;
  label: string;
  active: boolean;
  self?: boolean;
}) {
  const base = "flex-none whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium";
  if (active) {
    return (
      <Link
        href={href}
        className={`${base} ${
          self
            ? "border-gold bg-gold text-ink"
            : "border-ink bg-ink text-white"
        }`}
      >
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} border-line bg-white ${
        self ? "border-gold text-[#8B4A36]" : "text-ink-soft"
      }`}
    >
      {label}
    </Link>
  );
}
