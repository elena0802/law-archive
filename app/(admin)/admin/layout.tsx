import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";

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
        <div className="mx-auto max-w-5xl px-6 py-5">
          <p className="text-sm tracking-[0.18em] text-accent uppercase">
            서재 관리
          </p>
          <p className="text-keep mt-1 font-serif text-xl text-ink">
            형사법 아카이브
          </p>
        </div>
      </header>
      <AdminNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
