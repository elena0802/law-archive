import Link from "next/link";
import type { EssayStatus } from "@/lib/content/db-types";

type EssayPreviewBannerProps = {
  essayStatus?: EssayStatus;
  isDraft: boolean;
  editHref?: string;
  publicHref?: string;
};

function previewHeadline(essayStatus?: EssayStatus, isDraft?: boolean) {
  if (essayStatus === "archived") {
    return "보관 원고 미리보기";
  }

  if (essayStatus === "published") {
    return "미리보기";
  }

  return isDraft ? "임시 원고 미리보기" : "미리보기";
}

function previewDescription(essayStatus?: EssayStatus, isDraft?: boolean) {
  if (essayStatus === "archived") {
    return "이 글은 보관 상태입니다. 공개 서재에는 보이지 않으며, 관리 화면에서만 열람할 수 있습니다.";
  }

  if (essayStatus === "published") {
    return "이미 공개된 글입니다. 아래 내용은 공개 페이지와 같습니다.";
  }

  if (isDraft) {
    return "이 글은 아직 공개되지 않았습니다. 공개 서재에는 보이지 않습니다.";
  }

  return "이미 공개된 글입니다. 아래 내용은 공개 페이지와 같습니다.";
}

export function EssayPreviewBanner({
  essayStatus,
  isDraft,
  editHref,
  publicHref,
}: EssayPreviewBannerProps) {
  const headline = previewHeadline(essayStatus, isDraft);
  const description = previewDescription(essayStatus, isDraft);
  const showPublicLink =
    publicHref && (essayStatus === "published" || (!essayStatus && !isDraft));

  return (
    <div
      className="border-b border-line bg-paper-muted px-6 py-4"
      role="status"
    >
      <div className="mx-auto max-w-reading">
        <p className="text-sm tracking-[0.14em] text-accent uppercase">
          {headline}
        </p>
        <p className="text-keep mt-2 text-base leading-7 text-ink-muted">
          {description}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {editHref ? (
            <Link
              className="text-accent underline-offset-4 hover:underline"
              href={editHref}
            >
              편집으로 돌아가기
            </Link>
          ) : null}
          {showPublicLink ? (
            <Link
              className="text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              href={publicHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              공개 페이지 보기
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
