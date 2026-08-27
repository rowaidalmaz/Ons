"use client";

import { useState } from "react";
import { getDeviceId } from "@/lib/device";

type Resource = { title: string; description: string | null; phone: string | null; url: string | null };

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "submitted"; note: string | null }
  | { kind: "crisis"; resources: Resource[] }
  | { kind: "error" };

const NOTE_MAX = 240;

/** One other mother's note to hand back after posting. Chosen on submit (not
 *  during render) so it stays fixed once shown. */
function pickNote(pool: string[]): string | null {
  if (!pool.length) return null;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return pick.length > NOTE_MAX ? `${pick.slice(0, NOTE_MAX).trimEnd()}…` : pick;
}

export function PostComposer({ notePool }: { notePool: string[] }) {
  const [body, setBody] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const [heartSent, setHeartSent] = useState(false);

  async function submit() {
    if (!body.trim()) return;
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, deviceId: getDeviceId() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState({ kind: "error" });
        return;
      }
      if (data.flagged) {
        setState({ kind: "crisis", resources: data.resources ?? [] });
      } else {
        setState({ kind: "submitted", note: pickNote(notePool) });
        setBody("");
      }
    } catch {
      setState({ kind: "error" });
    }
  }

  if (state.kind === "crisis") {
    return (
      <div className="mb-3 rounded-2xl border border-gold bg-gold-pale p-5 text-[13px] leading-7 text-ink">
        <p className="mb-2 font-bold">حابين نطمن عليك أول شي 🤍</p>
        <p className="mb-2">ما قدرنا ننشر هذا المنشور، بس تقدرين تتواصلين مع أحد الجهات التالية إذا تحتاجين مساعدة فورية:</p>
        <ul className="list-inside list-disc space-y-1">
          {state.resources.map((r, i) => (
            <li key={i}>
              <b>{r.title}</b>
              {r.phone ? ` — ${r.phone}` : ""}
              {r.url ? (
                <>
                  {" "}
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-gold underline">
                    رابط
                  </a>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (state.kind === "submitted") {
    return (
      <div className="mb-3 space-y-3">
        <div className="rounded-2xl border border-gold bg-gold-pale p-5 text-[13px] leading-7 text-ink">
          <p className="mb-1 font-bold">وصلت رسالتك 🤍</p>
          <p>يشوفها فريقنا بسرعة وتنضاف للمساحة. شكرًا إنك شاركتي.</p>
        </div>

        {state.note && (
          <div className="rounded-2xl border border-line bg-white p-4 text-[13px] leading-7 text-ink-soft">
            <p className="mb-2 text-[11px] font-bold text-ink">وإنتِ هنا — رسالة من أم ثانية:</p>
            <p className="mb-3">{state.note}</p>
            <button
              type="button"
              onClick={() => setHeartSent(true)}
              disabled={heartSent}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-colors ${
                heartSent ? "bg-gold-pale text-[#9a3412]" : "bg-tint text-ink-soft hover:bg-gold-pale"
              }`}
            >
              {heartSent ? "وصلها قلبك 🤍" : "أرسلي لها قلب 🤍"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-3">
      <p className="mb-2 text-[11px] font-bold text-ink-soft">ردّك على سؤال اليوم</p>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="اكتبي هنا، بدون اسم…"
        rows={3}
        className="mb-2 w-full rounded-xl border border-line bg-white p-4 text-[13.5px] leading-7 text-charcoal outline-none focus:border-ink"
      />
      <button
        type="button"
        onClick={submit}
        disabled={state.kind === "submitting" || !body.trim()}
        className="w-full rounded-xl bg-ink py-3.5 text-[14px] font-bold text-white transition-opacity disabled:opacity-50"
      >
        {state.kind === "error" ? "ما ضبطت — جرّبي مرة ثانية" : "أرسلي، بدون اسم"}
      </button>
    </div>
  );
}
