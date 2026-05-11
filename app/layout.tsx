import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "실시간 전자 방명록",
  description: "사진과 그림, 댓글이 실시간으로 흐르는 따뜻한 전자 방명록",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff7df",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.variable} min-h-screen bg-paper text-ink antialiased`}>{children}</body>
    </html>
  );
}
