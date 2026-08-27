import Link from "next/link";
import type { Section } from "@/lib/supabase/types";

const SECTIONS: { slug: Section; label: string }[] = [
  { slug: "about", label: "عنك" },
  { slug: "parenting", label: "تربيتك" },
];

export function SectionTabs({ active }: { active: Section }) {
  return (
    <div className="mb-4 inline-flex rounded-full border border-line bg-white p-1">
      {SECTIONS.map((s) => {
        const isActive = active === s.slug;
        return (
          <Link
            key={s.slug}
            href={`/?section=${s.slug}`}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-[13px] font-bold transition-colors ${
              isActive ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {s.label}
          </Link>
        );
      })}
    </div>
  );
}
