import { essayStatusLabel } from "@/components/admin/essay-status-badge";
import type { EssayStatus } from "@/lib/content/db-types";

export function EssayStatusRow({ status }: { status: EssayStatus }) {
  return (
    <p className="text-keep text-sm leading-7 text-ink-muted">
      <span className="tracking-[0.08em] text-accent uppercase">상태</span>
      <span aria-hidden="true" className="mx-2 text-line">
        ·
      </span>
      <span className="font-medium text-ink">{essayStatusLabel(status)}</span>
    </p>
  );
}
