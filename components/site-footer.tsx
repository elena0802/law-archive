import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-muted">
      <Container className="flex flex-col gap-4 py-8 text-sm leading-7 text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{siteConfig.name}</p>
        <p>{siteConfig.tagline}</p>
      </Container>
    </footer>
  );
}
