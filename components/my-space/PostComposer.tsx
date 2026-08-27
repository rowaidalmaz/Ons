"use client";

import { useState } from "react";

const DEVICE_ID_KEY = "uns_anon_device_id";

function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "submitted" }
  | { kind: "crisis"; resources: { title: string; description: string | null; phone: string | null; url: string | null }[] }
  | { kind: "error" };

export function PostComposer() {
  const [body, setBody] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

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
        setState({ kind: "submitted" });
        setBody("");
      }
    } catch {
      setState({ kind: "error" });
    }
  }

  if (state.kind === "crisis") {
    return (
      <div className="mb-3 rounded-2xl border border-gold bg-gold-pale p-4 text-[12.5px] leading-7 text-ink">
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

  return (
    <div className="mb-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="شاركي الحين بخاطرك، بدون اسم"
        rows={3}
        className="mb-2 w-full rounded-2xl border border-line bg-white p-3.5 text-[12.5px] leading-7 text-charcoal outline-none"
      />
      <button
        type="button"
        onClick={submit}
        disabled={state.kind === "submitting" || !body.trim()}
        className="w-full rounded-2xl bg-ink py-3.5 text-[13px] font-bold text-[#F3EEE3] disabled:opacity-50"
      >
        {state.kind === "submitted" ? "تم الإرسال، بانتظار المراجعة 🤍" : "شاركي الحين بخاطرك، بدون اسم"}
      </button>
    </div>
  );
}
