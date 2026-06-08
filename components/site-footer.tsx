import { Container } from "@/components/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-muted">
      <Container className="flex flex-col items-center gap-7 py-12 text-center">
        <p className="text-keep max-w-md text-sm leading-8 text-ink-muted">
          형사법, 사회, 기술에 대한 생각을
          <br />
          AI와 함께 기록하는 디지털 연구 노트
        </p>
        <form
          action="/search"
          className="w-full max-w-[28rem]"
          method="get"
        >
          <label className="sr-only" htmlFor="footer-search">
            검색어
          </label>
          <div className="flex flex-row gap-2">
            <input
              className="text-keep min-w-0 flex-1 rounded border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25"
              id="footer-search"
              name="q"
              placeholder="검색어를 입력하세요"
              type="search"
            />
            <button
              className="shrink-0 rounded border border-accent bg-accent px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-accent/90"
              type="submit"
            >
              검색
            </button>
          </div>
        </form>
      </Container>
    </footer>
  );
}
