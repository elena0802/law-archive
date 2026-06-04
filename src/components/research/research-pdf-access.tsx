import type { ResearchItem } from "@/src/types/research";

type ResearchPdfAccessProps = {
  item: ResearchItem;
};

export function ResearchPdfAccess({ item }: ResearchPdfAccessProps) {
  if (!item.pdfUrl) {
    return null;
  }

  return (
    <section
      aria-labelledby="research-pdf-access-heading"
      className="mt-12 border-t border-line pt-10"
    >
      <h2
        id="research-pdf-access-heading"
        className="font-serif text-xl leading-tight text-ink"
      >
        원문 열람
      </h2>
      <p className="text-keep mt-3 text-base leading-[1.85] text-ink-muted">
        이 논문의 원문 PDF를 새 창에서 열람할 수 있습니다.
      </p>
      <p className="mt-5">
        <a
          className="inline-flex border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-ink-muted"
          href={item.pdfUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          PDF 열기
        </a>
      </p>
    </section>
  );
}
