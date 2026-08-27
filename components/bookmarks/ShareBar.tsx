"use client";

import { useState } from "react";

export function ShareBar({ collectionId }: { collectionId: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/saved/${collectionId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "محفوظاتي في أُنس", url });
        return;
      } catch {
        // user dismissed the sheet — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("انسخي الرابط:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
    >
      <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" />
      </svg>
      {copied ? "تم نسخ الرابط ✓" : "شاركي القائمة"}
    </button>
  );
}
