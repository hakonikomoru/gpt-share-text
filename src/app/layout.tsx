import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "ShareText — ChatGPT 共有をテキストに",
  description:
    "ChatGPT の共有 URL を貼るだけで会話全文をプレーンテキストに起こします。保存不要・コピーして Notion やメモに。",
  openGraph: {
    title: "ShareText — ChatGPT 共有をテキストに",
    description: "ChatGPT 共有リンクから会話をプレーンテキスト化",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
