import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { TabBar } from "@/components/nav/TabBar";
import { FriezeStrip } from "@/components/ui/FriezeStrip";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "أُنس",
  description: "تعبانة الملم، عادي. أُنس ما تضويك في الطريق، بس تحن عليك.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper">
        <header className="relative overflow-hidden text-[#F3EEE3] [background:radial-gradient(120%_160%_at_20%_-10%,#C97B5D_0%,#9C4E38_55%,#6B3324_100%)]">
          <div className="pointer-events-none absolute inset-0 [background:radial-gradient(320px_200px_at_85%_0%,rgba(240,184,160,0.35),transparent_70%)]" />
          <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5">
              <svg
                className="h-8 w-8 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F0B8A0"
                strokeWidth={1.4}
              >
                <path d="M9 2h6M12 2v3" />
                <path d="M7 6h10l-1.2 11.5c-.15 1.4-1.35 2.5-2.8 2.5h-2c-1.45 0-2.65-1.1-2.8-2.5L7 6Z" />
                <path d="M9 6c0-2 1-3.5 3-3.5s3 1.5 3 3.5" />
                <path d="M12 20v2M9.5 22h5" />
                <circle cx="12" cy="11" r="2.3" fill="#F0B8A0" stroke="none" />
              </svg>
              <span className="text-2xl font-black tracking-wide text-[#F0B8A0]">
                أُنس
              </span>
            </div>
            <p className="mt-1.5 max-w-md text-[13px] leading-7 text-[#F3E2D6]">
              تعبانة الملم، عادي. أُنس ما يضويك في الطريق، بس يحن عليك 🌙
            </p>
          </div>
        </header>
        <FriezeStrip />
        <TabBar />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
