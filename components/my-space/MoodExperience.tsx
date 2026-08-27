"use client";

import { useEffect, useState } from "react";
import { useMoodPlayer, type MoodAudioType } from "@/lib/audio/useMoodPlayer";
import { getDeviceId } from "@/lib/device";
import type { BookRow, MoodCheckin, MoodRow } from "@/lib/supabase/types";

const TRAIL_DAYS = 14;

/** The mother's local (Riyadh) day as 'YYYY-MM-DD' — matches the server default. */
function riyadhToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" });
}

/** The last N local days, newest first, as 'YYYY-MM-DD'. */
function recentDays(n: number): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" }));
  }
  return days;
}

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
function toArabicDigits(n: number): string {
  return String(n).replace(/\d/g, (d) => AR_DIGITS[Number(d)]);
}

export function MoodExperience({
  moods,
  booksByMood,
}: {
  moods: MoodRow[];
  booksByMood: Record<string, BookRow[]>;
}) {
  const [selected, setSelected] = useState<MoodRow | null>(null);
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [checkins, setCheckins] = useState<MoodCheckin[]>([]);
  const player = useMoodPlayer();

  // Hydrate the trail from the server once (device id is browser-only).
  useEffect(() => {
    const deviceId = getDeviceId();
    let cancelled = false;
    fetch(`/api/checkins?deviceId=${deviceId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d: { checkins: MoodCheckin[] }) => {
        if (!cancelled) setCheckins(d.checkins ?? []);
      })
      .catch(() => {
        /* offline — the trail just stays empty this session */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function selectMood(mood: MoodRow) {
    setSelected(mood);
    player.play(mood.audio_config.type as MoodAudioType);

    // Record today's check-in: optimistic, then reconcile with the server.
    const today = riyadhToday();
    setCheckins((prev) => [
      { checked_on: today, mood_slug: mood.slug },
      ...prev.filter((c) => c.checked_on !== today),
    ]);
    fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId: getDeviceId(), moodSlug: mood.slug }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d: { checkins: MoodCheckin[] }) => setCheckins(d.checkins ?? []))
      .catch(() => {
        /* keep the optimistic dot; it re-syncs on the next visit */
      });
  }

  function togglePlay() {
    if (!selected) return;
    if (player.playing) player.stopAll();
    else player.play(selected.audio_config.type as MoodAudioType);
  }

  const books = selected ? (booksByMood[selected.slug] ?? []) : [];

  const checkedDays = new Set(checkins.map((c) => c.checked_on));
  const moodByDay = new Map(checkins.map((c) => [c.checked_on, c.mood_slug]));
  const emojiBySlug = new Map(moods.map((m) => [m.slug, m.emoji]));
  const trail = recentDays(TRAIL_DAYS);
  const today = trail[0];
  const doneCount = checkins.length;

  return (
    <div>
      <div className="mb-4 rounded-2xl border border-line bg-gold-pale p-4">
        <p className="mb-2.5 text-[12px] font-bold leading-6 text-[#9a3412]">
          {doneCount === 0
            ? "سجّلي مزاجك اليوم — نبدأ من هنا 🤍"
            : `رجعتِ لنفسك ${toArabicDigits(doneCount)} ${doneCount === 1 ? "مرة" : "مرات"} — كل مرة تعدّ 🤍`}
        </p>
        {/* RTL row: newest-first array puts today on the right (reading start). */}
        <div className="flex gap-1.5">
          {trail.map((day) => {
            const checked = checkedDays.has(day);
            const isToday = day === today;
            return (
              <span
                key={day}
                title={day === today ? "اليوم" : day}
                className={`flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] leading-none transition-colors ${
                  checked
                    ? "bg-gold text-white"
                    : isToday
                      ? "border border-dashed border-gold-soft bg-white"
                      : "bg-gold-soft/25"
                }`}
              >
                {checked ? (emojiBySlug.get(moodByDay.get(day) ?? "") ?? "") : ""}
              </span>
            );
          })}
        </div>
      </div>

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
          اختاري مزاجك، وخلّينا نضبط الجو لك 🎧
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
