"use client";

import { useActionState } from "react";
import type { EssayActionState } from "@/lib/admin/essay-action-state";
import { essayActionIdleState } from "@/lib/admin/essay-action-state";
import type { EssayFormValues } from "@/lib/admin/parse-essay-form";
import type { SeriesRow } from "@/lib/content/db-types";

const inputClassName =
  "mt-2 w-full rounded border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30";

const labelClassName = "text-keep block text-base font-medium text-ink";

type EssayFormProps = {
  mode: "create" | "edit";
  initialValues: EssayFormValues;
  series: Pick<SeriesRow, "slug" | "title">[];
  slugLocked: boolean;
  action: (
    prevState: EssayActionState,
    formData: FormData,
  ) => Promise<EssayActionState>;
  savedMessage?: string;
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

export function EssayForm({
  mode,
  initialValues,
  series,
  slugLocked,
  action,
  savedMessage,
}: EssayFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    essayActionIdleState,
  );

  const fieldErrors = state.fieldErrors ?? {};
  const bannerMessage =
    savedMessage ??
    (state.status === "error" ? state.message : undefined) ??
    (state.status === "success" ? state.message : undefined);

  return (
    <form action={formAction} className="mt-10 space-y-8">
      {bannerMessage ? (
        <p
          className="text-keep rounded border border-line bg-paper-muted px-4 py-3 text-base leading-7 text-ink"
          role="status"
        >
          {bannerMessage}
        </p>
      ) : null}

      <div>
        <label className={labelClassName} htmlFor="title">
          제목
        </label>
        <input
          className={inputClassName}
          defaultValue={initialValues.title}
          id="title"
          name="title"
          required
          type="text"
        />
        <FieldError message={fieldErrors.title} />
      </div>

      <div>
        <label className={labelClassName} htmlFor="slug">
          주소 (slug)
        </label>
        <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
          공개 주소는 /essays/주소 형태입니다. 영문 소문자와 하이픈만
          사용합니다.
          {slugLocked ? " 공개된 글은 주소를 바꿀 수 없습니다." : null}
        </p>
        {slugLocked ? (
          <input name="slug" type="hidden" value={initialValues.slug} />
        ) : null}
        <input
          className={inputClassName}
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

      <div>
        <label className={labelClassName} htmlFor="description">
          한 줄 소개
        </label>
        <textarea
          className={`${inputClassName} min-h-[5rem] resize-y`}
          defaultValue={initialValues.description}
          id="description"
          name="description"
          required
          rows={3}
        />
        <FieldError message={fieldErrors.description} />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label className={labelClassName} htmlFor="essay_date">
            글 날짜
          </label>
          <input
            className={inputClassName}
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
            className={inputClassName}
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

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label className={labelClassName} htmlFor="series_slug">
            연재
          </label>
          <select
            className={inputClassName}
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
          <label className={labelClassName} htmlFor="status">
            상태
          </label>
          <select
            className={inputClassName}
            defaultValue={initialValues.status}
            id="status"
            name="status"
            required
          >
            <option value="draft">임시 저장 (비공개)</option>
            <option value="published">공개</option>
          </select>
          <FieldError message={fieldErrors.status} />
          <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
            공개로 저장하면 CONTENT_SOURCE=supabase일 때 공개 서재에 반영됩니다.
            MDX 모드에서는 파일 기반 글이 계속 표시됩니다.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input
          className="mt-1 size-4 accent-accent"
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

      <div>
        <label className={labelClassName} htmlFor="content">
          본문
        </label>
        <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
          일반 글처럼 작성합니다. 소제목은 ## 로 시작할 수 있습니다.
        </p>
        <textarea
          className={`${inputClassName} min-h-[20rem] font-mono text-[0.95rem] leading-7`}
          defaultValue={initialValues.content}
          id="content"
          name="content"
          rows={24}
        />
        <FieldError message={fieldErrors.content} />
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
        <button
          className="rounded border border-accent bg-accent px-5 py-3 text-base font-medium text-paper transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "저장 중…" : mode === "create" ? "글 저장" : "변경 저장"}
        </button>
      </div>
    </form>
  );
}
