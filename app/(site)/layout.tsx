import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-paper focus:px-3 focus:py-2 focus:text-sm focus:text-ink focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent"
        href="#main-content"
      >
        본문으로 건너뛰기
      </a>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
