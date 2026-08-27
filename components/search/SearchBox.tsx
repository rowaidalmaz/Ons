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
      className="mb-2.5 flex items-center gap-2 rounded-2xl border border-line bg-white px-3.5 py-2.5"
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="#B5A190" strokeWidth={1.8}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-3.8-3.8" />
      </svg>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-none bg-transparent text-[13.5px] text-charcoal outline-none"
      />
    </form>
  );
}
