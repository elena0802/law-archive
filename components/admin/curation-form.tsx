"use client";

import { useActionState, useState } from "react";
import {
  adminFieldClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
} from "@/components/admin/admin-form-styles";
import { AdminNoticeBanner } from "@/components/admin/admin-notice-banner";
import type { EssayActionState } from "@/lib/admin/essay-action-state";
import { essayActionIdleState } from "@/lib/admin/essay-action-state";
import { adminCurationProfessorNotePlaceholder } from "@/lib/admin/curation-copy";
import type { CurationFormValues } from "@/lib/admin/parse-curation-form";
import { CURATION_TYPES, CURATION_TYPE_LABELS } from "@/lib/curation/youtube";

type CurationFormProps = {
  mode: "create" | "edit";
  itemId?: string;
  initialValues: CurationFormValues;
  action: (
    prevState: EssayActionState,
    formData: FormData,
  ) => Promise<EssayActionState>;
  deleteAction?: (formData: FormData) => void;
  noticeMessage?: string;
};

export function CurationForm({
  mode,
  itemId,
  initialValues,
  action,
  deleteAction,
  noticeMessage,
}: CurationFormProps) {
  const [state, formAction, isPending] = useActionState(action, essayActionIdleState);
  const [type, setType] = useState(initialValues.type);
  const [isVisible, setIsVisible] = useState(initialValues.is_visible);
  const [isFeatured, setIsFeatured] = useState(initialValues.is_featured);
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="mx-auto mt-10 max-w-reading space-y-10">
      {noticeMessage ? <AdminNoticeBanner message={noticeMessage} /> : null}
      {state.status === "error" && state.message ? (
        <p className="text-keep rounded border border-accent/40 bg-paper-muted px-5 py-4 text-base leading-7 text-accent">
          {state.message}
        </p>
      ) : null}

      <div className="space-y-3 border-b border-line pb-10">
        <label className={adminLabelClassName} htmlFor="type">
          콘텐츠 유형
        </label>
        <select
          className={adminFieldClassName}
          id="type"
          name="type"
          onChange={(event) => setType(event.currentTarget.value as CurationFormValues["type"])}
          value={type}
        >
          {CURATION_TYPES.map((itemType) => (
            <option key={itemType} value={itemType}>
              {CURATION_TYPE_LABELS[itemType]}
            </option>
          ))}
        </select>
        {fieldErrors.type ? (
          <p className="mt-2 text-sm text-accent">{fieldErrors.type}</p>
        ) : null}

        <label className={`${adminLabelClassName} mt-6`} htmlFor="title">
          제목
        </label>
        <input
          className={`${adminFieldClassName} font-serif text-2xl leading-snug`}
          defaultValue={initialValues.title}
          id="title"
          name="title"
          required
          type="text"
        />
        {fieldErrors.title ? (
          <p className="mt-2 text-sm text-accent">{fieldErrors.title}</p>
        ) : null}

        <label className={`${adminLabelClassName} mt-6`} htmlFor="professor_note">
          추천 이유
        </label>
        <textarea
          className={`${adminFieldClassName} min-h-[7rem] resize-y leading-8`}
          defaultValue={initialValues.professor_note}
          id="professor_note"
          name="professor_note"
          placeholder={adminCurationProfessorNotePlaceholder}
          rows={4}
        />
        <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
          홈페이지와 목록에 1~2줄로 표시됩니다. 링크 공유보다 추천 이유 전달이
          중요합니다.
        </p>

        <label className={`${adminLabelClassName} mt-6`} htmlFor="url">
          링크 (URL)
        </label>
        <input
          className={adminFieldClassName}
          defaultValue={initialValues.url}
          id="url"
          name="url"
          placeholder={
            type === "youtube"
              ? "https://www.youtube.com/watch?v=..."
              : "https://"
          }
          required
          type="url"
        />
        {fieldErrors.url ? (
          <p className="mt-2 text-sm text-accent">{fieldErrors.url}</p>
        ) : null}
        <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
          {type === "youtube"
            ? "유튜브 동영상 주소를 입력합니다. 공개 사이트에서는 내부 모달로 재생됩니다."
            : "기사·외부글·논문·책은 외부 링크로 연결됩니다. 본문은 저장하지 않습니다."}
        </p>

        <label className={`${adminLabelClassName} mt-6`} htmlFor="description">
          한 줄 소개 (선택)
        </label>
        <textarea
          className={`${adminFieldClassName} min-h-[6rem] resize-y leading-8`}
          defaultValue={initialValues.description}
          id="description"
          name="description"
          placeholder="콘텐츠 내용을 짧게 요약합니다."
          rows={3}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label className={adminLabelClassName} htmlFor="source">
            출처 (선택)
          </label>
          <input
            className={adminFieldClassName}
            defaultValue={initialValues.source}
            id="source"
            name="source"
            placeholder="매체명, 채널명, 출판사 등"
            type="text"
          />
        </div>

        <div>
          <label className={adminLabelClassName} htmlFor="thumbnail_url">
            썸네일 URL (선택)
          </label>
          <input
            className={adminFieldClassName}
            defaultValue={initialValues.thumbnail_url}
            id="thumbnail_url"
            name="thumbnail_url"
            placeholder="비워 두면 유튜브는 자동 생성"
            type="url"
          />
        </div>

        <div>
          <label className={adminLabelClassName} htmlFor="published_at">
            원본 게시일 (선택)
          </label>
          <input
            className={adminFieldClassName}
            defaultValue={initialValues.published_at}
            id="published_at"
            name="published_at"
            type="date"
          />
        </div>

        <div>
          <label className={adminLabelClassName} htmlFor="recommended_at">
            추천 날짜
          </label>
          <input
            className={adminFieldClassName}
            defaultValue={initialValues.recommended_at}
            id="recommended_at"
            name="recommended_at"
            required
            type="date"
          />
          {fieldErrors.recommended_at ? (
            <p className="mt-2 text-sm text-accent">{fieldErrors.recommended_at}</p>
          ) : null}
        </div>

        <div>
          <label className={adminLabelClassName} htmlFor="sort_order">
            정렬 순서 (선택)
          </label>
          <input
            className={adminFieldClassName}
            defaultValue={
              initialValues.sort_order === 0 ? "" : String(initialValues.sort_order)
            }
            id="sort_order"
            name="sort_order"
            placeholder="비워 두기"
            type="number"
            min={0}
          />
          {fieldErrors.sort_order ? (
            <p className="mt-2 text-sm text-accent">{fieldErrors.sort_order}</p>
          ) : null}
          <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
            비워두거나 같은 값이면 추천 날짜 기준으로 정렬됩니다. 특별히 위에
            고정하고 싶을 때만 사용하세요.
          </p>
        </div>
      </div>

      <div className="space-y-4 border-t border-line pt-8">
        <label className="flex items-start gap-3">
          <input
            checked={isVisible}
            className="mt-1"
            name="is_visible"
            onChange={(event) => setIsVisible(event.currentTarget.checked)}
            type="checkbox"
          />
          <span className="text-keep text-base leading-8 text-ink">
            공개 사이트에 표시
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            checked={isFeatured}
            className="mt-1"
            name="is_featured"
            onChange={(event) => setIsFeatured(event.currentTarget.checked)}
            type="checkbox"
          />
          <span className="text-keep text-base leading-8 text-ink">
            홈페이지 대표 콘텐츠로 표시
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
        <button
          className={adminPrimaryButtonClassName}
          disabled={isPending}
          type="submit"
        >
          {isPending ? "저장 중…" : mode === "create" ? "저장" : "변경사항 저장"}
        </button>

        {mode === "edit" && deleteAction ? (
          <button
            className="rounded border border-line bg-paper px-5 py-3 text-base text-accent transition hover:border-accent/40"
            formAction={deleteAction}
            onClick={(event) => {
              if (
                !window.confirm(
                  "이 큐레이션 항목을 삭제합니다. 삭제 후에는 복구할 수 없습니다.",
                )
              ) {
                event.preventDefault();
              }
            }}
            type="submit"
          >
            삭제
          </button>
        ) : null}

        {itemId ? (
          <p className="text-keep text-sm text-ink-muted">ID: {itemId}</p>
        ) : null}
      </div>
    </form>
  );
}
