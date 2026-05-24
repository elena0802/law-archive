import Link from "next/link";
import { Container } from "@/components/container";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/essays", label: "Essays" },
  { href: "/series", label: "Series" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <Container className="flex flex-col gap-6 py-6 sm:flex-row sm:items-end sm:justify-between">
        <Link
          className="max-w-64 font-serif text-2xl leading-none tracking-normal text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/"
        >
          Criminal Law Archive
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm uppercase tracking-[0.16em] text-ink-muted">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  className="hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
