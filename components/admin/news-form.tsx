"use client";

import { useActionState, useState } from "react";
import {
  adminFieldClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
} from "@/components/admin/admin-form-styles";
import { AdminNoticeBanner } from "@/components/admin/admin-notice-banner";
import { essayActionIdleState, type EssayActionState } from "@/lib/admin/essay-action-state";
import { type NewsFormValues } from "@/lib/admin/parse-news-form";
import { NEWS_CATEGORIES } from "@/lib/news/types";

type NewsFormProps = {
  mode: "create" | "edit";
  itemId?: string;
  initialValues: NewsFormValues;
  action: (
    prevState: EssayActionState,
    formData: FormData,
  ) => Promise<EssayActionState>;
  deleteAction?: (formData: FormData) => void;
  noticeMessage?: string;
};

export function NewsForm({
  mode,
  itemId,
  initialValues,
  action,
  deleteAction,
  noticeMessage,
}: NewsFormProps) {
  const [state, formAction, isPending] = useActionState(action, essayActionIdleState);
  const [featured, setFeatured] = useState(initialValues.featured);
  const [published, setPublished] = useState(initialValues.published);
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="mx-auto mt-10 max-w-reading space-y-10">
      {noticeMessage ? <AdminNoticeBanner message={noticeMessage} /> : null}
      {state.status === "error" && state.message ? (
        <p className="text-keep rounded border border-accent/40 bg-paper-muted px-5 py-4 text-base leading-7 text-accent">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-8 border-b border-line pb-10 sm:grid-cols-2">
        <div>
          <label className={adminLabelClassName} htmlFor="date">
            날짜
          </label>
          <input
            className={adminFieldClassName}
            defaultValue={initialValues.date}
            id="date"
            name="date"
            required
            type="date"
          />
          {fieldErrors.date ? <p className="mt-2 text-sm text-accent">{fieldErrors.date}</p> : null}
        </div>

        <div>
          <label className={adminLabelClassName} htmlFor="category">
            분류
          </label>
          <select
            className={adminFieldClassName}
            defaultValue={initialValues.category}
            id="category"
            name="category"
          >
            {NEWS_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {fieldErrors.category ? (
            <p className="mt-2 text-sm text-accent">{fieldErrors.category}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label className={adminLabelClassName} htmlFor="title">
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
          {fieldErrors.title ? <p className="mt-2 text-sm text-accent">{fieldErrors.title}</p> : null}
        </div>

        <div className="sm:col-span-2">
          <label className={adminLabelClassName} htmlFor="summary">
            요약
          </label>
          <textarea
            className={`${adminFieldClassName} min-h-[7rem] resize-y leading-8`}
            defaultValue={initialValues.summary}
            id="summary"
            name="summary"
            required
            rows={4}
          />
          {fieldErrors.summary ? (
            <p className="mt-2 text-sm text-accent">{fieldErrors.summary}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label className={adminLabelClassName} htmlFor="image">
            이미지 URL (선택)
          </label>
          <input
            className={adminFieldClassName}
            defaultValue={initialValues.image}
            id="image"
            name="image"
            placeholder="/images/news/korea-law-ai-symposium-poster.jpg"
            type="text"
          />
          {fieldErrors.image ? <p className="mt-2 text-sm text-accent">{fieldErrors.image}</p> : null}
        </div>

        <div className="sm:col-span-2">
          <label className={adminLabelClassName} htmlFor="link">
            링크 URL (선택)
          </label>
          <input
            className={adminFieldClassName}
            defaultValue={initialValues.link}
            id="link"
            name="link"
            placeholder="https://"
            type="url"
          />
          {fieldErrors.link ? <p className="mt-2 text-sm text-accent">{fieldErrors.link}</p> : null}
        </div>
      </div>

      <div className="space-y-4 border-t border-line pt-8">
        <label className="flex items-start gap-3">
          <input
            checked={featured}
            className="mt-1"
            name="featured"
            onChange={(event) => setFeatured(event.currentTarget.checked)}
            type="checkbox"
          />
          <span className="text-keep text-base leading-8 text-ink">
            주요 소식(Featured)으로 표시
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input
            checked={published}
            className="mt-1"
            name="published"
            onChange={(event) => setPublished(event.currentTarget.checked)}
            type="checkbox"
          />
          <span className="text-keep text-base leading-8 text-ink">
            공개 사이트에 표시
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
        <button className={adminPrimaryButtonClassName} disabled={isPending} type="submit">
          {isPending ? "저장 중…" : mode === "create" ? "저장" : "변경사항 저장"}
        </button>

        {mode === "edit" && deleteAction ? (
          <button
            className="rounded border border-line bg-paper px-5 py-3 text-base text-accent transition hover:border-accent/40"
            formAction={deleteAction}
            onClick={(event) => {
              if (!window.confirm("이 소식 항목을 삭제합니다. 삭제 후에는 복구할 수 없습니다.")) {
                event.preventDefault();
              }
            }}
            type="submit"
          >
            삭제
          </button>
        ) : null}

        {itemId ? <p className="text-keep text-sm text-ink-muted">ID: {itemId}</p> : null}
      </div>
    </form>
  );
}
