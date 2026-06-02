"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAdmin } from "@/app/(admin)/admin/actions";

const linkClassName =
  "text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const activeLinkClassName =
  "text-sm font-medium text-ink underline underline-offset-4";

export function AdminNav() {
  const pathname = usePathname();

  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/auth/")
  ) {
    return null;
  }

  const isDashboard = pathname === "/admin";
  const isEssayList =
    pathname === "/admin/essays" || pathname.startsWith("/admin/essays/");
  const isNew = pathname === "/admin/essays/new";

  return (
    <nav
      aria-label="서재 관리 메뉴"
      className="border-b border-line bg-paper-muted/40"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
        <Link
          className={isDashboard ? activeLinkClassName : linkClassName}
          href="/admin"
        >
          대시보드
        </Link>
        <Link
          className={
            isEssayList && !isNew ? activeLinkClassName : linkClassName
          }
          href="/admin/essays"
        >
          글 목록
        </Link>
        <Link
          className={isNew ? activeLinkClassName : linkClassName}
          href="/admin/essays/new"
        >
          새 글 작성
        </Link>
        <Link className={linkClassName} href="/">
          공개 서재 보기
        </Link>
        <form action={signOutAdmin} className="ml-auto">
          <button className={linkClassName} type="submit">
            로그아웃
          </button>
        </form>
      </div>
    </nav>
  );
}
