"use client";

import { useState } from "react";
import { useMoodPlayer, type MoodAudioType } from "@/lib/audio/useMoodPlayer";
import type { BookRow, MoodRow } from "@/lib/supabase/types";

export function MoodExperience({
  moods,
  booksByMood,
}: {
  moods: MoodRow[];
  booksByMood: Record<string, BookRow[]>;
}) {
  const [selected, setSelected] = useState<MoodRow | null>(null);
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const player = useMoodPlayer();

  function selectMood(mood: MoodRow) {
    setSelected(mood);
    player.play(mood.audio_config.type as MoodAudioType);
  }

  function togglePlay() {
    if (!selected) return;
    if (player.playing) player.stopAll();
    else player.play(selected.audio_config.type as MoodAudioType);
  }

  const books = selected ? (booksByMood[selected.slug] ?? []) : [];

  return (
    <div>
      <div className="mb-4 flex justify-between gap-1 rounded-2xl bg-tint p-2">
        {moods.map((m) => (
          <button
            key={m.slug}
            type="button"
            onClick={() => selectMood(m)}
            aria-label={m.label_ar}
            aria-pressed={selected?.slug === m.slug}
            className={`flex h-11 w-11 items-center justify-center rounded-full text-[19px] transition-colors ${
              selected?.slug === m.slug ? "bg-gold" : "bg-paper hover:bg-paper-deep"
            }`}
          >
            {m.emoji}
          </button>
        ))}
      </div>

      {selected ? (
        <div className="mb-4 rounded-2xl bg-ink p-5 text-white">
          <p className="mb-2 text-[11px] font-bold tracking-wide text-gold-soft">
            بناءً على إنك تشعرين بـ {selected.emoji} {selected.label_ar}
          </p>
          <div className="my-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => setLang("ar")}
              className={`rounded-lg px-3 py-1 text-[11px] font-bold transition-colors ${
                lang === "ar" ? "bg-gold text-white" : "bg-white/10 text-white/70 hover:text-white"
              }`}
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-lg px-3 py-1 text-[11px] font-bold transition-colors ${
                lang === "en" ? "bg-gold text-white" : "bg-white/10 text-white/70 hover:text-white"
              }`}
            >
              English
            </button>
          </div>
          <div className="mb-3 text-[17px] font-bold">
            {lang === "ar" ? selected.track_title_ar : selected.track_title_en}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-gold text-white"
              aria-label={player.playing ? "إيقاف" : "تشغيل"}
            >
              {player.playing ? (
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <div className="flex h-[26px] flex-1 items-end gap-[3px]">
              {player.eqLevels.map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-sm bg-gold-soft transition-[height] duration-150"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="h-[15px] w-[15px] flex-none text-white/70"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 9v6h4l5 5V4L9 9H5Z" />
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={player.volume}
              onChange={(e) => player.setVolume(parseFloat(e.target.value))}
              className="flex-1 accent-gold"
            />
          </div>
        </div>
      ) : (
        <p className="mb-4 rounded-2xl border border-line bg-white p-5 text-center text-[13.5px] leading-7 text-ink-soft">
          شي حاسة الملم، اختاري مزاجك، وخلينا نضبط الجو لك 🎧
        </p>
      )}

      {selected && (
        <div className="mb-4">
          <p className="mb-3 mt-4 text-[13px] font-bold leading-7 text-ink">
            📚 كتب عنك أنتِ — لا عن طفلك فقط
          </p>
          {books.map((b) => (
            <div
              key={b.id}
              className="mb-2.5 flex gap-3 rounded-2xl border border-line bg-white p-3.5"
            >
              <div
                className="flex h-[60px] w-[44px] flex-none items-center justify-center rounded-lg text-lg text-white"
                style={{ background: "linear-gradient(160deg, var(--sage), #0a7d54)" }}
              >
                📖
              </div>
              <div>
                <span
                  className={`mb-1 inline-block rounded-md px-1.5 py-0.5 text-[9.5px] font-bold text-white ${
                    b.language === "en" ? "bg-sage" : "bg-dustyblue"
                  }`}
                >
                  {b.language.toUpperCase()}
                </span>
                <h4 className="mb-0.5 text-[13.5px] font-bold text-ink">{b.title}</h4>
                <p className="text-[12px] leading-6 text-ink-soft">
                  <b className="text-ink">{b.author}</b> — {b.blurb}
                </p>
              </div>
            </div>
          ))}
          <div className="mt-1 rounded-xl bg-gold-pale px-3 py-2.5 text-[12px] leading-7 text-[#9a3412]">
            كتب حقيقية لكن على الفكرة — النسخة الفعلية تربط مباشرة بمتاجر/مكتبات لشرائها أو قراءتها.
          </div>
        </div>
      )}
    </div>
  );
}
