"use client";

import { useActionState } from "react";
import { EssayStatusSelector } from "@/components/admin/essay-status-selector";
import type { EssayActionState } from "@/lib/admin/essay-action-state";
import { essayActionIdleState } from "@/lib/admin/essay-action-state";
import type { EssayFormValues } from "@/lib/admin/parse-essay-form";
import type { EssayStatus } from "@/lib/content/db-types";
import type { SeriesRow } from "@/lib/content/db-types";

const fieldClassName =
  "mt-3 w-full rounded border border-line bg-paper px-4 py-3.5 text-base text-ink outline-none transition focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25";

const labelClassName = "text-keep block text-base font-medium text-ink";

type EssayFormProps = {
  mode: "create" | "edit";
  initialValues: EssayFormValues;
  currentStatus: EssayStatus;
  previewSlug?: string;
  series: Pick<SeriesRow, "slug" | "title">[];
  slugLocked: boolean;
  action: (
    prevState: EssayActionState,
    formData: FormData,
  ) => Promise<EssayActionState>;
  noticeMessage?: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-keep mt-2 text-sm leading-6 text-accent" role="alert">
      {message}
    </p>
  );
}

function FormBanner({
  message,
  tone,
}: {
  message: string;
  tone: "success" | "error";
}) {
  return (
    <p
      className={
        tone === "success"
          ? "text-keep rounded border border-line bg-paper-muted px-5 py-4 text-base leading-7 text-ink"
          : "text-keep rounded border border-accent/40 bg-paper-muted px-5 py-4 text-base leading-7 text-accent"
      }
      role={tone === "error" ? "alert" : "status"}
    >
      {message}
    </p>
  );
}

const primaryButtonClassName =
  "rounded border border-accent bg-accent px-5 py-3 text-base font-medium text-paper transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60";

export function EssayForm({
  mode,
  initialValues,
  currentStatus,
  previewSlug,
  series,
  slugLocked,
  action,
  noticeMessage,
}: EssayFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    essayActionIdleState,
  );

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="mx-auto mt-10 max-w-reading space-y-10">
      <input name="current_status" type="hidden" value={currentStatus} />

      {noticeMessage ? (
        <FormBanner message={noticeMessage} tone="success" />
      ) : null}

      {state.status === "error" && state.message ? (
        <FormBanner message={state.message} tone="error" />
      ) : null}

      <div className="space-y-3 border-b border-line pb-10">
        <label className={labelClassName} htmlFor="title">
          제목
        </label>
        <input
          className={`${fieldClassName} font-serif text-2xl leading-snug`}
          defaultValue={initialValues.title}
          id="title"
          name="title"
          placeholder="글 제목을 입력합니다"
          required
          type="text"
        />
        <FieldError message={fieldErrors.title} />
      </div>

      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <label className={labelClassName} htmlFor="essay_date">
            글 날짜
          </label>
          <input
            className={fieldClassName}
            defaultValue={initialValues.essay_date}
            id="essay_date"
            name="essay_date"
            required
            type="date"
          />
          <FieldError message={fieldErrors.essay_date} />
        </div>

        <div>
          <label className={labelClassName} htmlFor="category">
            분류
          </label>
          <input
            className={fieldClassName}
            defaultValue={initialValues.category}
            id="category"
            name="category"
            placeholder="예: 형벌론"
            required
            type="text"
          />
          <FieldError message={fieldErrors.category} />
        </div>
      </div>

      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <label className={labelClassName} htmlFor="series_slug">
            연재
          </label>
          <select
            className={fieldClassName}
            defaultValue={initialValues.series_slug}
            id="series_slug"
            name="series_slug"
            required
          >
            <option disabled value="">
              연재 선택
            </option>
            {series.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.series_slug} />
        </div>

        <div>
          <label className={labelClassName} htmlFor="slug">
            주소 (slug)
          </label>
          <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
            /essays/주소 형태입니다.
            {slugLocked ? " 공개된 글은 주소를 바꿀 수 없습니다." : null}
          </p>
          {slugLocked ? (
            <input name="slug" type="hidden" value={initialValues.slug} />
          ) : null}
          <input
            className={fieldClassName}
            defaultValue={initialValues.slug}
            disabled={slugLocked}
            id="slug"
            name={slugLocked ? undefined : "slug"}
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            readOnly={slugLocked}
            required={!slugLocked}
            type="text"
          />
          <FieldError message={fieldErrors.slug} />
        </div>
      </div>

      <div>
        <label className={labelClassName} htmlFor="description">
          한 줄 소개
        </label>
        <textarea
          className={`${fieldClassName} min-h-[6rem] resize-y leading-8`}
          defaultValue={initialValues.description}
          id="description"
          name="description"
          required
          rows={3}
        />
        <FieldError message={fieldErrors.description} />
      </div>

      <div className="flex items-start gap-3">
        <input
          className="mt-1.5 size-4 accent-accent"
          defaultChecked={initialValues.featured}
          id="featured"
          name="featured"
          type="checkbox"
        />
        <div>
          <label className={labelClassName} htmlFor="featured">
            대표 글
          </label>
          <p className="text-keep mt-1 text-sm leading-7 text-ink-muted">
            나중에 홈이나 추천 영역에 쓰일 수 있습니다.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className={labelClassName} htmlFor="content">
          본문
        </label>
        <p className="text-keep text-sm leading-7 text-ink-muted">
          평소 글쓰기처럼 작성하시면 됩니다. 소제목은 줄 앞에 ## 을 붙일 수
          있습니다.
        </p>
        <textarea
          className={`${fieldClassName} min-h-[32rem] resize-y text-[1.05rem] leading-8`}
          defaultValue={initialValues.content}
          id="content"
          name="content"
          placeholder="여기에 본문을 작성합니다."
          rows={32}
        />
        <FieldError message={fieldErrors.content} />
      </div>

      <div className="border-t border-line border-dashed pt-10">
        <EssayStatusSelector currentStatus={currentStatus} />
        {mode === "edit" && previewSlug ? (
          <p className="text-keep mt-6 text-sm leading-7 text-ink-muted">
            저장한 뒤{" "}
            <a
              className="text-accent underline-offset-4 hover:underline"
              href={`/preview/${previewSlug}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              미리보기
            </a>
            로 공개 전 모습을 확인할 수 있습니다.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-10">
        <button
          className={primaryButtonClassName}
          disabled={isPending}
          name="intent"
          type="submit"
          value="save"
        >
          {isPending ? "저장 중…" : "저장"}
        </button>
      </div>
    </form>
  );
}
