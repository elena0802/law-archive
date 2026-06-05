import { BookCover } from "@/src/components/research/book-cover";
import {
  representativeBooks,
  representativeBooksHeading,
  representativeBooksIntro,
  type RepresentativeBook,
} from "@/src/data/books";
import { formatBookCitation, formatBookLabel } from "@/lib/profile";

function RepresentativeBookItem({ book }: { book: RepresentativeBook }) {
  return (
    <li className="border-t border-line/70 py-6 first:border-t-0 first:pt-0 last:pb-0">
      <article className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="relative mx-auto aspect-[2/3] w-[5.5rem] shrink-0 overflow-hidden bg-paper-muted sm:mx-0 sm:w-[7rem]">
          <BookCover alt="" src={book.coverImage} title={book.title} />
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h3 className="text-keep font-serif text-lg leading-snug text-ink">
            {book.title}
          </h3>
          <p className="mt-2 text-sm tracking-wide text-ink-muted">
            {formatBookLabel(book)}
          </p>
          <p className="sr-only">{formatBookCitation(book)}</p>
          {book.note ? (
            <p className="text-keep mt-2 text-sm leading-relaxed text-ink-muted">
              {book.note}
            </p>
          ) : null}
        </div>
      </article>
    </li>
  );
}

export function ResearchRepresentativeBooks() {
  return (
    <section aria-labelledby="research-books-heading">
      <h2
        id="research-books-heading"
        className="font-serif text-2xl leading-tight text-ink sm:text-[1.75rem]"
      >
        {representativeBooksHeading}
      </h2>
      <p className="text-keep mt-3 text-base leading-[1.85] text-ink-muted">
        {representativeBooksIntro}
      </p>
      <ul
        aria-label={representativeBooksHeading}
        className="mt-8 list-none space-y-0 p-0"
      >
        {representativeBooks.map((book) => (
          <RepresentativeBookItem key={book.id} book={book} />
        ))}
      </ul>
    </section>
  );
}
