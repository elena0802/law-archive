"use client";

type PublishConfirmDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function PublishConfirmDialog({
  open,
  onCancel,
  onConfirm,
}: PublishConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      aria-labelledby="publish-confirm-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/25 px-6"
      role="dialog"
    >
      <div className="w-full max-w-md rounded border border-line bg-paper px-6 py-6 shadow-sm">
        <h2
          className="text-keep font-serif text-2xl leading-tight text-ink"
          id="publish-confirm-title"
        >
          글을 공개하시겠습니까?
        </h2>
        <p className="text-keep mt-4 text-base leading-8 text-ink-muted">
          이 글은 공개 서재에 즉시 노출됩니다.
        </p>
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button
            className="rounded border border-line bg-paper px-5 py-3 text-base text-ink transition hover:border-accent/40"
            onClick={onCancel}
            type="button"
          >
            취소
          </button>
          <button
            className="rounded border border-accent bg-accent px-5 py-3 text-base font-medium text-paper transition hover:bg-accent/90"
            onClick={onConfirm}
            type="button"
          >
            공개하기
          </button>
        </div>
      </div>
    </div>
  );
}
