"use client";

import Image from "next/image";
import { useState } from "react";

type BookCoverProps = {
  alt: string;
  src: string;
  title: string;
};

function BookCoverPlaceholder({ title }: { title: string }) {
  return (
    <div
      aria-hidden
      className="flex h-full w-full flex-col items-center justify-center border border-line/80 bg-[linear-gradient(160deg,var(--paper-muted)_0%,var(--paper)_70%)] px-3 py-4 text-center"
    >
      <span className="font-serif text-3xl leading-none text-line/90">著</span>
      <span className="text-keep mt-3 line-clamp-3 text-[0.625rem] leading-snug text-ink-muted/80">
        {title}
      </span>
    </div>
  );
}

export function BookCover({ alt, src, title }: BookCoverProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <BookCoverPlaceholder title={title} />;
  }

  return (
    <Image
      alt={alt}
      className="h-full w-full object-cover"
      fill
      onError={() => setFailed(true)}
      sizes="(min-width: 640px) 7rem, 5.5rem"
      src={src}
    />
  );
}
