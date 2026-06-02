import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "서재 관리",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm tracking-[0.18em] text-accent uppercase">
              서재 관리
            </p>
            <p className="text-keep mt-1 font-serif text-lg text-ink">
              형사법 아카이브
            </p>
          </div>
          <Link
            className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            href="/"
          >
            공개 서재
          </Link>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
