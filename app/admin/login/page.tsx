"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin/moderation` },
    });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="mx-auto max-w-sm py-10">
      <h2 className="mb-4 text-xl font-extrabold text-ink">تسجيل دخول المشرفات</h2>
      {sent ? (
        <p className="text-[13px] leading-7 text-ink-soft">
          أرسلنا رابط الدخول إلى {email} — تحققي من بريدك.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني"
            className="w-full rounded-2xl border border-line bg-white p-3.5 text-[13px] outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-ink py-3.5 text-[13px] font-bold text-[#F3EEE3]"
          >
            إرسال رابط الدخول
          </button>
          {error && <p className="text-[12px] text-gold">{error}</p>}
        </form>
      )}
    </div>
  );
}
