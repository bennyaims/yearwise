import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Yearwise — Australian Curriculum Years 7–12",
    template: "%s · Yearwise",
  },
  description:
    "Maths, Science, Chemistry, English, Languages, unfiltered Australian History and Music for Years 7–12.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8eef7" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1220" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="ambient-root flex min-h-full flex-col font-sans">
        <AmbientBackground />
        <Header />
        <main className="relative flex-1">{children}</main>
        <footer className="site-footer">
          <p className="text-ink font-medium opacity-80">
            Yearwise · Australian secondary learning · Years 7–12
          </p>
          <p className="mt-1 text-xs text-soft">
            Starter curriculum content for learning — expand and align to your
            state syllabus (NSW, VIC, QLD, SA, WA, TAS, ACT, NT).
          </p>
        </footer>
      </body>
    </html>
  );
}
