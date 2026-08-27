"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBox({
  action,
  placeholder,
  defaultValue,
}: {
  action: string;
  placeholder: string;
  defaultValue?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(value ? `${action}?q=${encodeURIComponent(value)}` : action);
      }}
      className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-4 py-3 focus-within:border-ink"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] flex-none text-ink-soft"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-3.8-3.8" />
      </svg>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-none bg-transparent text-[14px] text-charcoal outline-none placeholder:text-ink-soft"
      />
    </form>
  );
}
