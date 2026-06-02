"use client";

import {
  permanentlyDeleteEssay,
  restoreDeletedEssay,
} from "@/app/(admin)/admin/essays/actions";

type EssayTrashActionsProps = {
  essayId: string;
};

export function EssayTrashActions({ essayId }: EssayTrashActionsProps) {
  return (
    <>
      <form action={restoreDeletedEssay.bind(null, essayId)}>
        <button
          className="text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          type="submit"
        >
          복원
        </button>
      </form>
      <form action={permanentlyDeleteEssay.bind(null, essayId)}>
        <button
          className="text-keep text-ink-muted underline-offset-4 hover:text-ink hover:underline"
          onClick={(event) => {
            if (!confirm("정말 삭제하시겠습니까?")) {
              event.preventDefault();
            }
          }}
          type="submit"
        >
          영구 삭제
        </button>
      </form>
    </>
  );
}
