"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  label: string;
  match: "exact" | "prefix";
  ariaLabel?: string;
};

function isActive(pathname: string, href: string, match: NavLinkProps["match"]) {
  if (match === "exact") {
    return pathname === href;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ href, label, match, ariaLabel }: NavLinkProps) {
  const pathname = usePathname();
  const active = isActive(pathname, href, match);

  return (
    <Link
      aria-current={active ? "page" : undefined}
      aria-label={ariaLabel}
      className={
        active
          ? "border-b border-accent pb-0.5 text-ink"
          : "text-ink-muted hover:text-ink"
      }
      href={href}
    >
      {label}
    </Link>
  );
}
