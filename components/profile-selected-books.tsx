import { AboutSection } from "@/components/about-section";
import { BookCover } from "@/src/components/research/book-cover";
import {
  formatBookCitation,
  formatBookLabel,
  type ProfileBook,
  type ProfileBooksSection,
} from "@/lib/profile";

type ProfileSelectedBooksProps = {
  section: ProfileBooksSection;
  id?: string;
  intro?: string;
};

function SelectedBookItem({ book }: { book: ProfileBook }) {
  return (
    <li className="text-keep border-t border-line/70 py-5 first:border-t-0 first:pt-0 last:pb-0">
      <article className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        {book.coverImage ? (
          <div className="relative aspect-[2/3] w-[4.5rem] shrink-0 overflow-hidden bg-paper-muted sm:w-[5.5rem]">
            <BookCover alt="" src={book.coverImage} title={book.title} />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="font-serif text-lg leading-snug text-ink">{book.title}</p>
          <p className="mt-1 text-sm tracking-wide text-ink-muted">
            {formatBookLabel(book)}
          </p>
          <p className="sr-only">{formatBookCitation(book)}</p>
          {book.note ? (
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {book.note}
            </p>
          ) : null}
        </div>
      </article>
    </li>
  );
}

export function ProfileSelectedBooks({
  section,
  id = "selected-books",
  intro,
}: ProfileSelectedBooksProps) {
  return (
    <AboutSection heading={section.heading} id={id}>
      {intro ? (
        <p className="text-keep text-ink-muted not-first:mt-0">{intro}</p>
      ) : null}
      <ul
        className={`list-none space-y-0 p-0 ${intro ? "mt-6" : ""}`}
        aria-label={section.heading}
      >
        {section.books.map((book) => (
          <SelectedBookItem key={book.id} book={book} />
        ))}
      </ul>
    </AboutSection>
  );
}
