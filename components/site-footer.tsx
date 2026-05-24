import { Container } from "@/components/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-muted">
      <Container className="flex flex-col gap-4 py-8 text-sm leading-7 text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Criminal Law Archive</p>
        <p>형사법의 글과 강의 노트를 조용히 모으는 디지털 서재.</p>
      </Container>
    </footer>
  );
}
