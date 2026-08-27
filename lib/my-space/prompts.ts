/**
 * سؤال اليوم — a rotating, forward-looking prompt for the مساحتي community
 * space. It reframes posts as something a mother *offers* (a message, a piece
 * of advice, a small win) rather than an open venting wall, which keeps the
 * feed from turning into a misery scroll.
 *
 * Static and deterministic (keyed by the local calendar day), so it needs no
 * storage and every mother sees the same question on the same day.
 */
export const DAILY_PROMPTS = [
  "اكتبي رسالة قصيرة لأم تعيش نفس يومك.",
  "وش الشي الصغير اللي ساعدك تكمّلين اليوم؟",
  "شي تتمنّين إن أحد قاله لك أول ما صرتِ أم؟",
  "وش صار اليوم وتبين تتذكّرينه بعدين؟",
  "لو أم جديدة قاعدة جنبك، وش تقولين لها؟",
  "أعطينا جملة وحدة تهدّي أم متوترة الحين.",
  "وش الشي اللي سامحتِ نفسك عليه هالأسبوع؟",
];

/** The prompt for a given day — stable per Riyadh calendar day. */
export function promptForToday(now: Date = new Date()): string {
  const day = now.toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" });
  const dayNumber = Math.floor(Date.parse(day) / 86_400_000);
  return DAILY_PROMPTS[dayNumber % DAILY_PROMPTS.length];
}
