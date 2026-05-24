import { Container } from "@/components/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-muted">
      <Container className="flex flex-col gap-4 py-8 text-sm leading-7 text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Criminal Law Archive</p>
        <p>Essays, lectures, and notes for a digital study.</p>
      </Container>
    </footer>
  );
}
