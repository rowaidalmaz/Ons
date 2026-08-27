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
      <div className="mb-4 flex justify-between rounded-2xl border border-line bg-white p-3.5">
        {moods.map((m) => (
          <button
            key={m.slug}
            type="button"
            onClick={() => selectMood(m)}
            aria-label={m.label_ar}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-[19px] ${
              selected?.slug === m.slug ? "bg-gold" : "bg-paper-deep"
            }`}
          >
            {m.emoji}
          </button>
        ))}
      </div>

      {selected ? (
        <div
          className="mb-4 rounded-[18px] p-4 text-[#F3EEE3]"
          style={{ background: "linear-gradient(135deg,#8A4A34,#5A2E20)" }}
        >
          <p className="mb-1 text-[10.5px] font-bold tracking-wide text-gold-soft">
            بناءً على إنك تشعرين بـ {selected.emoji} {selected.label_ar}
          </p>
          <div className="my-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => setLang("ar")}
              className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                lang === "ar" ? "border-gold bg-gold text-ink" : "border-white/25 text-[#F3E2D6]"
              }`}
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                lang === "en" ? "border-gold bg-gold text-ink" : "border-white/25 text-[#F3E2D6]"
              }`}
            >
              English
            </button>
          </div>
          <div className="mb-3 text-[17px] font-extrabold">
            {lang === "ar" ? selected.track_title_ar : selected.track_title_en}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-gold text-ink"
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
              className="h-[15px] w-[15px] flex-none"
              fill="none"
              stroke="#F3E2D6"
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
        <p className="mb-4 rounded-2xl border border-line bg-white p-4 text-center text-[12.5px] leading-7 text-ink-soft">
          شي حاسة الملم، اختاري مزاجك، وخلينا نضبط الجو لك 🎧
        </p>
      )}

      {selected && (
        <div className="mb-4">
          <p className="mb-2 mt-4 text-[12.5px] leading-7 text-ink-soft">
            📚 كتب عنك أنتِ — لا عن طفلك فقط
          </p>
          {books.map((b) => (
            <div key={b.id} className="mb-2.5 flex gap-2.5 rounded-[14px] border border-line bg-white p-3.5">
              <div
                className="flex h-[58px] w-[42px] flex-none items-center justify-center rounded-md text-lg text-white"
                style={{ background: "linear-gradient(160deg, var(--sage), #5E6B44)" }}
              >
                📖
              </div>
              <div>
                <span
                  className={`mb-1 inline-block rounded-lg px-1.5 py-0.5 text-[9.5px] font-bold text-white ${
                    b.language === "en" ? "bg-sage" : "bg-dustyblue"
                  }`}
                >
                  {b.language.toUpperCase()}
                </span>
                <h4 className="mb-0.5 text-[13px] text-ink">{b.title}</h4>
                <p className="text-[11.5px] leading-6 text-[#7A6659]">
                  <b>{b.author}</b> — {b.blurb}
                </p>
              </div>
            </div>
          ))}
          <div className="mt-0.5 rounded-lg bg-gold-pale px-2.5 py-2 text-[11px] leading-7 text-[#A6875A]">
            كتب حقيقية لكن على الفكرة — النسخة الفعلية تربط مباشرة بمتاجر/مكتبات لشرائها أو قراءتها.
          </div>
        </div>
      )}
    </div>
  );
}
