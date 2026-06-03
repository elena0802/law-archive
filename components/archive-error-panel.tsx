"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Container } from "@/components/container";

const actionClassName =
  "rounded border border-line bg-paper px-5 py-3 text-sm text-ink transition hover:border-accent/40 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const linkClassName =
  "inline-flex items-center rounded border border-line bg-paper px-5 py-3 text-sm text-ink-muted transition hover:border-accent/40 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

type ArchiveErrorPanelProps = {
  variant: "public" | "admin";
  eyebrow: string;
  title: string;
  supporting: string;
  homeHref: string;
  homeLabel: string;
  error: Error & { digest?: string };
  reset: () => void;
};

export function ArchiveErrorPanel({
  variant,
  eyebrow,
  title,
  supporting,
  homeHref,
  homeLabel,
  error,
  reset,
}: ArchiveErrorPanelProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const body = (
    <>
      <p className="mb-6 text-sm uppercase tracking-[0.18em] text-accent">
        {eyebrow}
      </p>
      <h1 className="text-keep font-serif text-3xl leading-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="text-keep mt-6 text-lg leading-8 text-ink-muted">
        {supporting}
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <button type="button" onClick={() => reset()} className={actionClassName}>
          다시 시도
        </button>
        <Link href={homeHref} className={linkClassName}>
          {homeLabel}
        </Link>
      </div>
    </>
  );

  if (variant === "admin") {
    return <div className="mx-auto max-w-5xl px-6 py-12">{body}</div>;
  }

  return (
    <section className="py-section py-page">
      <Container size="reading">{body}</Container>
    </section>
  );
}
