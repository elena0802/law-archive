import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"),
);

const siteDescription =
  "형사법을 오래 연구하고 가르친 학자의 글과 사유를 에세이와 시리즈로 정리한 디지털 서재입니다.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Criminal Law Archive",
    template: "%s | Criminal Law Archive",
  },
  description: siteDescription,
  applicationName: "Criminal Law Archive",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Criminal Law Archive",
    description: siteDescription,
    url: "/",
    siteName: "Criminal Law Archive",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full bg-paper text-ink antialiased">
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
