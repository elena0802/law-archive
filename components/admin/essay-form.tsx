"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { AdminCollapsibleSection } from "@/components/admin/admin-collapsible-section";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminFieldError } from "@/components/admin/admin-field-error";
import {
  adminFieldClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
} from "@/components/admin/admin-form-styles";
import {
  EssayMarkdownPreview,
  estimateEssayReadingMinutes,
  formatEssayCharacterCount,
} from "@/components/admin/essay-markdown-preview";
import { EssayStatusRow } from "@/components/admin/essay-status-row";
import { AdminNoticeBanner } from "@/components/admin/admin-notice-banner";
import type { SaveIntent } from "@/lib/admin/save-intent";
import type { EssayActionState } from "@/lib/admin/essay-action-state";
import { essayActionIdleState } from "@/lib/admin/essay-action-state";
import {
  generateEssaySlugFromTitle,
  type EssayFormValues,
} from "@/lib/admin/parse-essay-form";
import type { EssayStatus } from "@/lib/content/db-types";
import type { SeriesRow } from "@/lib/content/db-types";

const metadataSectionClassName = "space-y-8 border-t border-line/70 pt-8";

const metadataHeadingClassName =
  "text-keep text-sm tracking-[0.12em] text-accent uppercase";

const WRITING_GUIDE = `# 큰 제목
## 소제목
**강조할 문장**
- 목록
> 인용문
---
구분선`;

type EssayFormProps = {
  mode: "create" | "edit";
  initialValues: EssayFormValues;
  currentStatus: EssayStatus;
  series: Pick<SeriesRow, "slug" | "title">[];
  seriesOrderHints?: Record<string, number>;
  slugLocked: boolean;
  action: (
    prevState: EssayActionState,
    formData: FormData,
  ) => Promise<EssayActionState>;
  noticeMessage?: string;
};

type EssayFormSnapshot = {
  title: string;
  slug: string;
  description: string;
  content: string;
  essay_date: string;
  category: string;
  series_slug: string;
  series_order: string;
  featured: boolean;
};

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

function snapshotsEqual(a: EssayFormSnapshot, b: EssayFormSnapshot) {
  return (
    a.title === b.title &&
    a.slug === b.slug &&
    a.description === b.description &&
    a.content === b.content &&
    a.essay_date === b.essay_date &&
    a.category === b.category &&
    a.series_slug === b.series_slug &&
    a.series_order === b.series_order &&
    a.featured === b.featured
  );
}

function shouldGuardNavigation(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) {
    return false;
  }

  if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return false;
  }

  const url = new URL(anchor.href, window.location.href);

  // only guard same-origin navigations that leave the current writing page
  if (url.origin !== window.location.origin) {
    return false;
  }

  if (url.pathname === window.location.pathname && url.search === window.location.search) {
    return false;
  }

  return true;
}

export function EssayForm({
  mode,
  initialValues,
  currentStatus,
  series,
  seriesOrderHints = {},
  slugLocked,
  action,
  noticeMessage,
}: EssayFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    essayActionIdleState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const draftButtonRef = useRef<HTMLButtonElement>(null);
  const publishButtonRef = useRef<HTMLButtonElement>(null);
  const archiveButtonRef = useRef<HTMLButtonElement>(null);
  const trashButtonRef = useRef<HTMLButtonElement>(null);
  const publishConfirmedRef = useRef(false);
  const archiveConfirmedRef = useRef(false);
  const trashConfirmedRef = useRef(false);
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [category, setCategory] = useState(initialValues.category);
  const [essayDate, setEssayDate] = useState(initialValues.essay_date);
  const [featured, setFeatured] = useState(initialValues.featured);
  const [content, setContent] = useState(initialValues.content);
  const [slug, setSlug] = useState(initialValues.slug);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    mode === "edit" && Boolean(initialValues.slug),
  );
  const [selectedSeriesSlug, setSelectedSeriesSlug] = useState(
    initialValues.series_slug,
  );
  const [seriesOrder, setSeriesOrder] = useState(
    initialValues.series_order === null
      ? ""
      : String(initialValues.series_order),
  );
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [trashConfirmOpen, setTrashConfirmOpen] = useState(false);

  const fieldErrors = state.fieldErrors ?? {};
  const characterCount = formatEssayCharacterCount(content);
  const readingMinutes = estimateEssayReadingMinutes(content);
  const hasSubstantialBody = content.replace(/\s+/g, "").length > 400;
  const bodyTextareaMinHeightClass =
    mode === "create" && !hasSubstantialBody
      ? "min-h-[34rem]"
      : "min-h-[40rem]";
  const bodyTextareaRows = mode === "create" && !hasSubstantialBody ? 20 : 32;
  const initialSnapshot = useMemo<EssayFormSnapshot>(
    () => ({
      title: initialValues.title,
      slug: initialValues.slug,
      description: initialValues.description,
      content: initialValues.content,
      essay_date: initialValues.essay_date,
      category: initialValues.category,
      series_slug: initialValues.series_slug,
      series_order:
        initialValues.series_order === null
          ? ""
          : String(initialValues.series_order),
      featured: initialValues.featured,
    }),
    [initialValues],
  );

  const currentSnapshot = useMemo<EssayFormSnapshot>(
    () => ({
      title,
      slug: slugLocked ? initialValues.slug : slug,
      description,
      content,
      essay_date: essayDate,
      category,
      series_slug: selectedSeriesSlug,
      series_order: seriesOrder,
      featured,
    }),
    [
      title,
      slug,
      slugLocked,
      initialValues.slug,
      description,
      content,
      essayDate,
      category,
      selectedSeriesSlug,
      seriesOrder,
      featured,
    ],
  );

  const hasUnsavedChanges = useMemo(
    () => !snapshotsEqual(initialSnapshot, currentSnapshot),
    [currentSnapshot, initialSnapshot],
  );
  const isGuardEnabled = hasUnsavedChanges && !isPending;

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isGuardEnabled) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isGuardEnabled]);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!isGuardEnabled) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (!shouldGuardNavigation(anchor)) {
        return;
      }

      const confirmed = window.confirm(
        "저장하지 않은 변경사항이 있습니다. 페이지를 나가시겠습니까?",
      );
      if (!confirmed) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [isGuardEnabled]);

  const readSubmitIntent = useCallback((event: FormEvent<HTMLFormElement>) => {
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const value = submitter?.getAttribute("value");

    if (
      value === "publish" ||
      value === "archive" ||
      value === "trash" ||
      value === "draft"
    ) {
      return value as SaveIntent;
    }

    return "draft" as SaveIntent;
  }, []);

  const submitWithIntent = useCallback((intent: SaveIntent) => {
    const buttonRef =
      intent === "publish"
        ? publishButtonRef
        : intent === "archive"
          ? archiveButtonRef
          : intent === "trash"
            ? trashButtonRef
            : draftButtonRef;

    formRef.current?.requestSubmit(buttonRef.current ?? undefined);
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      const intent = readSubmitIntent(event);

      if (
        intent === "publish" &&
        currentStatus !== "published" &&
        !publishConfirmedRef.current
      ) {
        event.preventDefault();
        setPublishConfirmOpen(true);
        return;
      }

      if (intent === "archive" && !archiveConfirmedRef.current) {
        event.preventDefault();
        setArchiveConfirmOpen(true);
        return;
      }

      if (intent === "trash" && !trashConfirmedRef.current) {
        event.preventDefault();
        setTrashConfirmOpen(true);
        return;
      }

      publishConfirmedRef.current = false;
      archiveConfirmedRef.current = false;
      trashConfirmedRef.current = false;
    },
    [currentStatus, readSubmitIntent],
  );

  const handlePublishConfirm = useCallback(() => {
    setPublishConfirmOpen(false);
    publishConfirmedRef.current = true;
    submitWithIntent("publish");
  }, [submitWithIntent]);

  const handlePublishCancel = useCallback(() => {
    setPublishConfirmOpen(false);
  }, []);

  const handleArchiveConfirm = useCallback(() => {
    setArchiveConfirmOpen(false);
    archiveConfirmedRef.current = true;
    submitWithIntent("archive");
  }, [submitWithIntent]);

  const handleArchiveCancel = useCallback(() => {
    setArchiveConfirmOpen(false);
  }, []);

  const handleTrashConfirm = useCallback(() => {
    setTrashConfirmOpen(false);
    trashConfirmedRef.current = true;
    submitWithIntent("trash");
  }, [submitWithIntent]);

  const handleTrashCancel = useCallback(() => {
    setTrashConfirmOpen(false);
  }, []);

  const handleTitleChange = useCallback(
    (nextTitle: string) => {
      setTitle(nextTitle);
      if (slugLocked || slugManuallyEdited) {
        return;
      }
      setSlug(generateEssaySlugFromTitle(nextTitle));
    },
    [slugLocked, slugManuallyEdited],
  );

  const handleSeriesSlugChange = useCallback(
    (next: string) => {
      setSelectedSeriesSlug(next);
      if (!next) {
        setSeriesOrder("");
        return;
      }
      setSeriesOrder(String(seriesOrderHints[next] ?? 1));
    },
    [seriesOrderHints],
  );

  return (
    <form
      action={formAction}
      className="mx-auto mt-10 max-w-reading space-y-8"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <input name="current_status" type="hidden" value={currentStatus} />

      {noticeMessage ? <AdminNoticeBanner message={noticeMessage} /> : null}

      {state.status === "error" && state.message ? (
        <div className="space-y-3">
          <FormBanner message={state.message} tone="error" />
          {Object.keys(fieldErrors).length > 0 ? (
            <p className="text-keep text-sm leading-7 text-ink-muted">
              아래 표시된 항목을 확인해 주세요.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-3 border-b border-line/70 pb-8">
        <EssayStatusRow status={currentStatus} />
        <label className={`${adminLabelClassName} mt-4`} htmlFor="title">
          제목
        </label>
        <input
          className={`${adminFieldClassName} font-serif text-2xl leading-snug`}
          id="title"
          name="title"
          onChange={(event) => handleTitleChange(event.currentTarget.value)}
          placeholder="글 제목을 입력합니다"
          required
          type="text"
          value={title}
        />
        <AdminFieldError message={fieldErrors.title} />
        <label className={`${adminLabelClassName} mt-6`} htmlFor="content">
          본문
        </label>
        <textarea
          className={`${adminFieldClassName} ${bodyTextareaMinHeightClass} resize-y px-5 py-4 text-[1.08rem] leading-9`}
          id="content"
          name="content"
          placeholder="여기에 본문을 작성합니다."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={bodyTextareaRows}
        />
        <p className="text-keep text-sm leading-7 text-ink-muted">
          {characterCount}자 · 약 {readingMinutes}분 읽기
          {hasUnsavedChanges && !isPending ? " · 저장되지 않은 변경" : ""}
        </p>
        <AdminFieldError message={fieldErrors.content} />
      </div>

      <AdminCollapsibleSection label="작성 가이드">
        <pre className="text-keep whitespace-pre-wrap text-sm leading-7 text-ink-muted">
          {WRITING_GUIDE}
        </pre>
      </AdminCollapsibleSection>

      <div>
        <label className={adminLabelClassName} htmlFor="description">
          한 줄 소개
        </label>
        <textarea
          className={`${adminFieldClassName} min-h-[6rem] resize-y leading-8`}
          id="description"
          name="description"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="글의 요지를 한 줄로 적습니다."
          rows={3}
          value={description}
        />
        <AdminFieldError message={fieldErrors.description} />
      </div>

      <div className={metadataSectionClassName}>
        <p className={metadataHeadingClassName}>출판 정보</p>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label className={adminLabelClassName} htmlFor="essay_date">
              글 날짜
            </label>
            <input
              className={adminFieldClassName}
              id="essay_date"
              name="essay_date"
              onChange={(event) => setEssayDate(event.target.value)}
              type="date"
              value={essayDate}
            />
            <AdminFieldError message={fieldErrors.essay_date} />
          </div>

          <div>
            <label className={adminLabelClassName} htmlFor="category">
              분류
            </label>
            <input
              className={adminFieldClassName}
              id="category"
              name="category"
              onChange={(event) => setCategory(event.target.value)}
              placeholder="예: 형벌론"
              type="text"
              value={category}
            />
            <AdminFieldError message={fieldErrors.category} />
          </div>
        </div>

        <div>
          <label className={adminLabelClassName} htmlFor="series_slug">
            연재
          </label>
          <select
            className={adminFieldClassName}
            id="series_slug"
            name="series_slug"
            onChange={(event) => handleSeriesSlugChange(event.target.value)}
            value={selectedSeriesSlug}
          >
            <option value="">연재 선택</option>
            {series.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
          </select>
          <AdminFieldError message={fieldErrors.series_slug} />
        </div>

        {selectedSeriesSlug ? (
          <div>
            <label className={adminLabelClassName} htmlFor="series_order">
              연재 순서
            </label>
            <input
              className={adminFieldClassName}
              id="series_order"
              inputMode="numeric"
              min={1}
              name="series_order"
              onChange={(event) => setSeriesOrder(event.target.value)}
              placeholder="예: 1"
              type="number"
              value={seriesOrder}
            />
            <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
              현재 연재의 다음 순서가 자동 제안됩니다. 비워두면 제목 번호를
              기준으로 정렬됩니다.
            </p>
          </div>
        ) : null}
      </div>

      <AdminCollapsibleSection
        className="rounded border border-line/70 bg-paper"
        contentClassName="space-y-8 px-5 pb-5"
        label="고급 설정"
      >
        <div>
          <label className={adminLabelClassName} htmlFor="slug">
              주소 (slug)
            </label>
            <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
              주소는 글 제목을 바탕으로 정리할 수 있습니다. /essays/주소
              형태입니다.
              {slugLocked
                ? " 공개된 글은 주소를 바꿀 수 없습니다."
                : " 비워두면 저장 시 제목을 바탕으로 자동 생성됩니다."}
            </p>
            {slugLocked ? (
              <input name="slug" type="hidden" value={initialValues.slug} />
            ) : null}
            <input
              className={adminFieldClassName}
              disabled={slugLocked}
              id="slug"
              name={slugLocked ? undefined : "slug"}
              onChange={(event) => {
                setSlugManuallyEdited(true);
                setSlug(event.target.value);
              }}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              placeholder="제목에서 자동 생성"
              readOnly={slugLocked}
              type="text"
              value={slugLocked ? initialValues.slug : slug}
            />
            <AdminFieldError message={fieldErrors.slug} />
          </div>

          <div className="flex items-start gap-3">
            <input
              checked={featured}
              className="mt-1.5 size-4 accent-accent"
              id="featured"
              name="featured"
              onChange={(event) => setFeatured(event.target.checked)}
              type="checkbox"
            />
            <div>
              <label className={adminLabelClassName} htmlFor="featured">
                홈페이지 추천 글
              </label>
              <p className="text-keep mt-1 text-sm leading-7 text-ink-muted">
                홈페이지 주요 영역에 노출할 글로 추천합니다.
              </p>
            </div>
          </div>
      </AdminCollapsibleSection>

      <AdminCollapsibleSection
        className="rounded border border-line/60 bg-paper-muted/50"
        label="미리보기"
      >
        <div className="space-y-4">
          <p className="text-keep text-sm leading-7 text-ink-muted">
            저장 후 공개 화면에서 다시 확인할 수 있습니다.
          </p>
          <EssayMarkdownPreview source={content} />
        </div>
      </AdminCollapsibleSection>

      <div className="border-t border-line/70 pt-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-1.5">
            {hasUnsavedChanges && !isPending ? (
              <p className="text-keep text-sm font-medium leading-7 text-ink">
                저장하지 않은 변경사항이 있습니다.
              </p>
            ) : mode === "edit" ? (
              <p className="text-keep text-sm leading-7 text-ink-muted">
                모든 변경사항이 저장되었습니다.
              </p>
            ) : null}
            <p className="text-keep text-sm leading-7 text-ink-muted">
              {currentStatus === "published"
                ? "공개된 글의 변경은 「공개하기」로 저장합니다."
                : "임시 저장으로 작성을 이어가고, 준비가 되면 공개하기를 사용하세요."}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button
              className={adminSecondaryButtonClassName}
              disabled={isPending}
              name="intent"
              ref={draftButtonRef}
              type="submit"
              value="draft"
            >
              {isPending ? "저장 중…" : "임시 저장"}
            </button>
            <button
              className={adminPrimaryButtonClassName}
              disabled={isPending}
              name="intent"
              ref={publishButtonRef}
              type="submit"
              value="publish"
            >
              {isPending ? "저장 중…" : "공개하기"}
            </button>
          </div>
        </div>
      </div>

      {mode === "edit" && currentStatus !== "deleted" ? (
        <div className="border-t border-line/70 pt-8">
          <p className="text-keep text-sm font-medium text-ink-muted">글 관리</p>
          <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
            보관하거나 휴지통으로 옮기면 공개 서재에서 보이지 않습니다.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {currentStatus !== "archived" ? (
              <button
                className={adminSecondaryButtonClassName}
                disabled={isPending}
                name="intent"
                ref={archiveButtonRef}
                type="submit"
                value="archive"
              >
                보관
              </button>
            ) : null}
            <button
              className={adminSecondaryButtonClassName}
              disabled={isPending}
              name="intent"
              ref={trashButtonRef}
              type="submit"
              value="trash"
            >
              휴지통으로 이동
            </button>
          </div>
        </div>
      ) : null}

      <AdminConfirmDialog
        confirmLabel="공개하기"
        message="이 글은 공개 서재에 즉시 노출됩니다."
        onCancel={handlePublishCancel}
        onConfirm={handlePublishConfirm}
        open={publishConfirmOpen}
        title="글을 공개하시겠습니까?"
      />
      <AdminConfirmDialog
        confirmLabel="보관"
        message="이 글을 보관하시겠습니까?"
        onCancel={handleArchiveCancel}
        onConfirm={handleArchiveConfirm}
        open={archiveConfirmOpen}
        title="글을 보관하시겠습니까?"
      />
      <AdminConfirmDialog
        confirmLabel="휴지통으로 이동"
        message="이 글을 휴지통으로 이동하시겠습니까?"
        onCancel={handleTrashCancel}
        onConfirm={handleTrashConfirm}
        open={trashConfirmOpen}
        title="글을 휴지통으로 이동하시겠습니까?"
      />
    </form>
  );
}
