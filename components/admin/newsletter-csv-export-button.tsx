"use client";

import { useState } from "react";
import { downloadNewsletterSubscribersCsv } from "@/app/(admin)/admin/newsletter/actions";

const buttonClassName =
  "rounded border border-line bg-paper px-5 py-3 text-sm text-ink-muted transition hover:border-accent/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-60";

export function NewsletterCsvExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleExport() {
    setIsExporting(true);
    setErrorMessage(null);

    try {
      const csv = await downloadNewsletterSubscribersCsv();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "newsletter-subscribers.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setErrorMessage("CSV를 내보내지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        className={buttonClassName}
        disabled={isExporting}
        onClick={handleExport}
        type="button"
      >
        {isExporting ? "내보내는 중…" : "CSV 다운로드"}
      </button>
      {errorMessage ? (
        <p className="text-keep text-sm leading-6 text-ink-muted" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
