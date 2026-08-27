import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { TabBar } from "@/components/nav/TabBar";

const plex = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "أُنس",
  description: "تعبانة الملم، عادي. أُنس ما تضويك في الطريق، بس تحن عليك.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${plex.variable} antialiased`}>
      <body className="min-h-screen bg-paper text-charcoal">
        <header className="sticky top-0 z-40 w-full bg-paper/90 backdrop-blur lg:border-b lg:border-line">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6 lg:h-[72px] lg:px-8">
            <Link href="/" className="flex shrink-0 items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-ink">أُنس</span>
              <span className="hidden text-[12px] font-medium text-ink-soft sm:inline">
                · تحن عليك 🌙
              </span>
            </Link>
            <TabBar />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">{children}</main>
      </body>
    </html>
  );
}
