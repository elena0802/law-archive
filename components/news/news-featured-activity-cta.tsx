"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { homeSectionLinkClassName } from "@/components/home/home-section-link";
import {
  resolveFeaturedCtaBehavior,
  type FeaturedCtaBehavior,
} from "@/lib/news/types";

type NewsFeaturedActivityCtaProps = {
  title: string;
  imageSrc?: string;
  actionLink?: string;
  behavior?: FeaturedCtaBehavior;
  className?: string;
};

export function NewsFeaturedActivityCta({
  title,
  imageSrc,
  actionLink,
  behavior = "link",
  className,
}: NewsFeaturedActivityCtaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const resolvedBehavior = resolveFeaturedCtaBehavior(behavior);
  const hasImage = Boolean(imageSrc);
  const hasLink = Boolean(actionLink);
  const isExternalLink = actionLink?.startsWith("http") ?? false;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (resolvedBehavior === "none") {
    return null;
  }

  if (resolvedBehavior === "image") {
    if (!hasImage) {
      return null;
    }

    const posterSrc = imageSrc as string;
    return (
      <>
        <p className={className}>
          <button
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            className={homeSectionLinkClassName}
            onClick={() => setIsOpen(true)}
            type="button"
          >
            자세히 보기 →
          </button>
        </p>

        {isOpen ? (
          <div
            aria-label="소식 포스터 상세 보기"
            aria-modal="true"
            className="fixed inset-0 z-50 overflow-y-auto bg-ink/65"
            onClick={() => setIsOpen(false)}
            role="dialog"
          >
            <div className="flex min-h-full items-center justify-center p-5 sm:p-8 lg:p-10">
              <div
                className="flex max-w-[92vw] flex-col p-3 sm:p-4 lg:max-w-[70vw] lg:p-5"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-2 flex justify-end sm:mb-3">
                  <button
                    aria-label="포스터 닫기"
                    className="rounded border border-line/70 bg-paper/95 px-3 py-1.5 text-sm text-ink hover:border-accent/50"
                    onClick={() => setIsOpen(false)}
                    type="button"
                  >
                    닫기
                  </button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`${title} 포스터`}
                  className="mx-auto h-auto max-h-[80vh] w-auto max-w-[92vw] object-contain lg:max-h-[75vh] lg:max-w-[70vw]"
                  src={posterSrc}
                />
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }

  if (!hasLink) {
    return null;
  }

  const href = actionLink as string;
  return (
    <p className={className}>
      <Link
        className={homeSectionLinkClassName}
        href={href}
        rel={isExternalLink ? "noopener noreferrer" : undefined}
        target={isExternalLink ? "_blank" : undefined}
      >
        자세히 보기 →
      </Link>
    </p>
  );
}
