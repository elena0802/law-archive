import { AboutSection } from "@/components/about-section";
import {
  formatBookCitation,
  formatBookLabel,
  type ProfileBooksSection,
} from "@/lib/profile";

type ProfileSelectedBooksProps = {
  section: ProfileBooksSection;
  id?: string;
  intro?: string;
};

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
          <li
            key={book.id}
            className="text-keep border-t border-line/70 py-5 first:border-t-0 first:pt-0 last:pb-0"
          >
            <p className="font-serif text-lg leading-snug text-ink">
              {book.title}
            </p>
            <p className="mt-1 text-sm tracking-wide text-ink-muted">
              {formatBookLabel(book)}
            </p>
            <p className="sr-only">{formatBookCitation(book)}</p>
            {book.note ? (
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {book.note}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </AboutSection>
  );
}
