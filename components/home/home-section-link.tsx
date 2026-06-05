import Link from "next/link";
import type { ReactNode } from "react";

export const homeSectionLinkClassName =
  "cursor-pointer font-medium text-ink underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

type HomeSectionLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
};

export function HomeSectionLink({
  children,
  className = "mt-10",
  href,
}: HomeSectionLinkProps) {
  return (
    <p className={className}>
      <Link className={homeSectionLinkClassName} href={href}>
        {children}
      </Link>
    </p>
  );
}
