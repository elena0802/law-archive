import Link from "next/link";
import { Container } from "@/components/container";
import { researchPagePath } from "@/lib/research-record";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-muted">
      <Container className="flex flex-col gap-4 py-8 text-sm leading-7 text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{siteConfig.name}</p>
        <div className="flex flex-col gap-1 sm:items-end">
          <p>{siteConfig.tagline}</p>
          <p>
            <Link
              href={researchPagePath}
              className="text-ink underline decoration-line underline-offset-4 hover:text-accent"
            >
              연구업적
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
