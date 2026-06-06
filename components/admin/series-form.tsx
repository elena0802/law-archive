"use client";

import { useActionState } from "react";
import {
  adminFieldClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
} from "@/components/admin/admin-form-styles";
import { AdminNoticeBanner } from "@/components/admin/admin-notice-banner";
import type { EssayActionState } from "@/lib/admin/essay-action-state";
import { essayActionIdleState } from "@/lib/admin/essay-action-state";
import type { SeriesFormValues } from "@/lib/admin/parse-series-form";
import type { SeriesStatus } from "@/lib/content/db-types";

type SeriesFormProps = {
  mode: "create" | "edit";
  initialValues: SeriesFormValues;
  action: (
    prevState: EssayActionState,
    formData: FormData,
  ) => Promise<EssayActionState>;
  noticeMessage?: string;
  slugLocked?: boolean;
};

function statusLabel(status: SeriesStatus) {
  return status === "hidden" ? "숨김" : "활성";
}

export function SeriesForm({
  mode,
  initialValues,
  action,
  noticeMessage,
  slugLocked = false,
}: SeriesFormProps) {
  const [state, formAction, isPending] = useActionState(action, essayActionIdleState);
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
        <label className={adminLabelClassName} htmlFor="title">
          연재 제목
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

      <div>
        <label className={adminLabelClassName} htmlFor="slug">
          주소 (slug)
        </label>
        <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
          {slugLocked
            ? "주소(slug)는 기존 글과 연재 페이지 연결에 사용되므로 생성 후 수정하지 않습니다."
            : "영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다."}
        </p>
        {slugLocked ? <input name="slug" type="hidden" value={initialValues.slug} /> : null}
        <input
          className={adminFieldClassName}
          defaultValue={initialValues.slug}
          disabled={slugLocked}
          id="slug"
          name={slugLocked ? undefined : "slug"}
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          readOnly={slugLocked}
          required={!slugLocked}
          type="text"
        />
        {fieldErrors.slug ? <p className="mt-2 text-sm text-accent">{fieldErrors.slug}</p> : null}
      </div>

      <div>
        <label className={adminLabelClassName} htmlFor="description">
          설명
        </label>
        <textarea
          className={`${adminFieldClassName} min-h-[6rem] resize-y leading-8`}
          defaultValue={initialValues.description}
          id="description"
          name="description"
          rows={3}
        />
      </div>

      <div>
        <label className={adminLabelClassName} htmlFor="introduction">
          소개
        </label>
        <textarea
          className={`${adminFieldClassName} min-h-[10rem] resize-y leading-8`}
          defaultValue={initialValues.introduction}
          id="introduction"
          name="introduction"
          rows={5}
        />
      </div>

      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <label className={adminLabelClassName} htmlFor="display_order">
            정렬 순서
          </label>
          <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
            숫자가 작을수록 위에 표시됩니다.
          </p>
          <input
            className={adminFieldClassName}
            defaultValue={initialValues.display_order}
            id="display_order"
            name="display_order"
            required
            type="number"
          />
          {fieldErrors.display_order ? (
            <p className="mt-2 text-sm text-accent">{fieldErrors.display_order}</p>
          ) : null}
        </div>
        <div>
          <label className={adminLabelClassName} htmlFor="status">
            상태
          </label>
          <select
            className={adminFieldClassName}
            defaultValue={initialValues.status}
            id="status"
            name="status"
          >
            <option value="active">{statusLabel("active")}</option>
            <option value="hidden">{statusLabel("hidden")}</option>
          </select>
        </div>
      </div>

      <div className="pt-4">
        <button className={adminPrimaryButtonClassName} disabled={isPending} type="submit">
          {isPending ? "저장 중…" : mode === "create" ? "연재 생성" : "저장"}
        </button>
      </div>
    </form>
  );
}

