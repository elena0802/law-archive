import Link from "next/link";
import { Container } from "@/components/container";
import { NavLink } from "@/components/nav-link";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <Container className="flex flex-col gap-6 py-6 sm:flex-row sm:items-end sm:justify-between">
        <Link
          className="max-w-xs font-serif text-2xl leading-none tracking-normal text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/"
        >
          {siteConfig.name}
        </Link>
        <nav aria-label="주 메뉴">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm tracking-[0.08em]">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} match={item.match} />
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
