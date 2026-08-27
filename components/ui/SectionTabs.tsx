import Link from "next/link";

const SECTIONS = [
  { slug: "about", label: "عنك" },
  { slug: "parenting", label: "تربيتك" },
] as const;

export function SectionTabs({ active }: { active: string }) {
  return (
    <div className="mb-4 inline-flex rounded-full border border-line bg-white p-1">
      {SECTIONS.map((s) => (
        <Link
          key={s.slug}
          href={`/?section=${s.slug}`}
          className={`rounded-full px-4 py-1.5 text-[13px] font-bold ${
            active === s.slug ? "bg-ink text-white" : "text-ink-soft"
          }`}
        >
          {s.label}
        </Link>
      ))}
    </div>
  );
}
