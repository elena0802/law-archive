"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type EssayShareButtonProps = {
  title: string;
  url: string;
};

export function EssayShareButton({ title, url }: EssayShareButtonProps) {
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(() => {
    setToastVisible(true);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
      toastTimerRef.current = null;
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  async function handleShare() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast();
    } catch {
      // Clipboard unavailable — fail silently.
    }
  }

  return (
    <div className="relative">
      <button
        className="text-keep inline-flex items-center border border-line px-4 py-2 text-sm text-ink transition hover:border-accent/40 hover:bg-paper-muted hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        onClick={handleShare}
        type="button"
      >
        이 글 공유하기
      </button>
      {toastVisible ? (
        <p
          aria-live="polite"
          className="text-keep mt-3 text-sm text-ink-muted"
          role="status"
        >
          링크가 복사되었습니다.
        </p>
      ) : null}
    </div>
  );
}
