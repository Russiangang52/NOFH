import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Inter_Tight } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.fullName}`,
    template: "%s — НОФХ",
  },
  description:
    "Официальный сайт Нижегородской областной федерации хоккея: новости, расписание матчей, турнирные таблицы, документы, «Золотая шайба», судейство и контакты.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${interTight.variable}`}>
      <body className="bg-paper text-ink-900 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
