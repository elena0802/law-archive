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
import { AdminNoticeBanner } from "@/components/admin/admin-notice-banner";
import { EssayStatusBadge } from "@/components/admin/essay-status-badge";
import type { SaveIntent } from "@/lib/admin/save-intent";
import type { EssayActionState } from "@/lib/admin/essay-action-state";
import { essayActionIdleState } from "@/lib/admin/essay-action-state";
import {
  generateEssaySlugFromTitle,
  type EssayFormValues,
} from "@/lib/admin/parse-essay-form";
import type { EssayStatus } from "@/lib/content/db-types";
import type { SeriesRow } from "@/lib/content/db-types";

const fieldClassName =
  "mt-3 w-full rounded border border-line bg-paper px-4 py-3.5 text-base text-ink outline-none transition focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25";

const labelClassName = "text-keep block text-base font-medium text-ink";

const sectionPanelClassName =
  "space-y-10 rounded border border-line px-5 py-6";

const sectionHeadingClassName = "text-keep text-base font-medium text-ink";

const WRITING_GUIDE = `# 큰 제목
## 소제목
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

const secondaryButtonClassName =
  "rounded border border-line bg-paper px-5 py-3 text-base font-medium text-ink transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-60";

function formatCharacterCount(text: string) {
  return new Intl.NumberFormat("ko-KR").format(
    text.replace(/\s+/g, "").length,
  );
}

function estimateReadingMinutesFromChars(text: string) {
  const chars = text.replace(/\s+/g, "").length;
  return Math.max(1, Math.ceil(chars / 600));
}

type MarkdownNode =
  | { type: "h1" | "h2" | "p" | "quote"; content: string; key: string }
  | { type: "hr"; key: string }
  | { type: "list"; items: string[]; key: string };

function markdownToNodes(source: string): MarkdownNode[] {
  const lines = source.split("\n");
  const nodes: MarkdownNode[] = [];
  let idx = 0;

  while (idx < lines.length) {
    const line = lines[idx]?.trimEnd() ?? "";

    if (!line.trim()) {
      idx += 1;
      continue;
    }

    if (line === "---") {
      nodes.push({ type: "hr", key: `hr-${idx}` });
      idx += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      nodes.push({
        type: "h1",
        content: line.slice(2).trim(),
        key: `h1-${idx}`,
      });
      idx += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      nodes.push({
        type: "h2",
        content: line.slice(3).trim(),
        key: `h2-${idx}`,
      });
      idx += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (idx < lines.length && lines[idx].trimStart().startsWith("- ")) {
        items.push(lines[idx].trimStart().slice(2).trim());
        idx += 1;
      }
      nodes.push({ type: "list", items, key: `list-${idx}` });
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (idx < lines.length && lines[idx].trimStart().startsWith("> ")) {
        quoteLines.push(lines[idx].trimStart().slice(2).trim());
        idx += 1;
      }
      nodes.push({
        type: "quote",
        content: quoteLines.join(" "),
        key: `quote-${idx}`,
      });
      continue;
    }

    const paragraphLines: string[] = [line.trim()];
    idx += 1;
    while (idx < lines.length && lines[idx].trim()) {
      const next = lines[idx].trim();
      if (
        next.startsWith("# ") ||
        next.startsWith("## ") ||
        next.startsWith("- ") ||
        next.startsWith("> ") ||
        next === "---"
      ) {
        break;
      }
      paragraphLines.push(next);
      idx += 1;
    }
    nodes.push({
      type: "p",
      content: paragraphLines.join(" "),
      key: `p-${idx}`,
    });
  }

  return nodes;
}

function MarkdownPreview({ source }: { source: string }) {
  const nodes = useMemo(() => markdownToNodes(source), [source]);

  if (!source.trim()) {
    return (
      <p className="text-keep text-base leading-8 text-ink-muted">
        본문을 입력하면 여기에 미리보기가 표시됩니다.
      </p>
    );
  }

  return (
    <div className="archive-prose">
      {nodes.map((node) => {
        if (node.type === "h1") {
          return (
            <h1 className="text-keep mt-8 font-serif text-3xl text-ink" key={node.key}>
              {node.content}
            </h1>
          );
        }
        if (node.type === "h2") {
          return (
            <h2 className="text-keep mt-8 font-serif text-2xl text-ink" key={node.key}>
              {node.content}
            </h2>
          );
        }
        if (node.type === "list") {
          return (
            <ul className="mt-4 list-disc space-y-2 pl-6" key={node.key}>
              {node.items.map((item, itemIdx) => (
                <li className="text-keep text-ink" key={`${node.key}-${itemIdx}`}>
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        if (node.type === "quote") {
          return (
            <blockquote
              className="text-keep mt-4 border-l-2 border-line pl-4 italic text-ink-muted"
              key={node.key}
            >
              {node.content}
            </blockquote>
          );
        }
        if (node.type === "hr") {
          return <hr className="my-8 border-line" key={node.key} />;
        }
        return (
          <p className="text-keep mt-4 leading-8 text-ink" key={node.key}>
            {node.content}
          </p>
        );
      })}
    </div>
  );
}

function readSnapshotFromForm(form: HTMLFormElement): EssayFormSnapshot {
  const formData = new FormData(form);
  const read = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };
  return {
    title: read("title"),
    slug: read("slug"),
    description: read("description"),
    content: read("content"),
    essay_date: read("essay_date"),
    category: read("category"),
    series_slug: read("series_slug"),
    series_order: read("series_order"),
    featured: formData.get("featured") === "on",
  };
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [trashConfirmOpen, setTrashConfirmOpen] = useState(false);
  const isGuardEnabled = hasUnsavedChanges && !isSubmitting;

  const fieldErrors = state.fieldErrors ?? {};
  const characterCount = formatCharacterCount(content);
  const readingMinutes = estimateReadingMinutesFromChars(content);
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

  const refreshDirtyState = useCallback(() => {
    if (!formRef.current) {
      return;
    }
    const nextSnapshot = readSnapshotFromForm(formRef.current);
    setHasUnsavedChanges(!snapshotsEqual(initialSnapshot, nextSnapshot));
  }, [initialSnapshot]);

  useEffect(() => {
    refreshDirtyState();
  }, [content, refreshDirtyState]);

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

  const beginSubmit = useCallback(() => {
    setIsSubmitting(true);
    setHasUnsavedChanges(false);
  }, []);

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
      beginSubmit();
    },
    [beginSubmit, currentStatus, readSubmitIntent],
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

  const handleTitleInput = useCallback(
    (title: string) => {
      if (slugLocked || slugManuallyEdited) {
        return;
      }
      setSlug(generateEssaySlugFromTitle(title));
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
      className="mx-auto mt-10 max-w-reading space-y-10"
      onChangeCapture={refreshDirtyState}
      onInputCapture={refreshDirtyState}
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <input name="current_status" type="hidden" value={currentStatus} />

      {noticeMessage ? <AdminNoticeBanner message={noticeMessage} /> : null}

      {state.status === "error" && state.message ? (
        <FormBanner message={state.message} tone="error" />
      ) : null}

      <div className="space-y-3 border-b border-line pb-10">
        <EssayStatusBadge showHelper={false} status={currentStatus} />
        <label className={`${labelClassName} mt-6`} htmlFor="title">
          제목
        </label>
        <input
          className={`${fieldClassName} font-serif text-2xl leading-snug`}
          defaultValue={initialValues.title}
          id="title"
          name="title"
          onInput={(event) => handleTitleInput(event.currentTarget.value)}
          placeholder="글 제목을 입력합니다"
          required
          type="text"
        />
        <FieldError message={fieldErrors.title} />
        <label className={`${labelClassName} mt-6`} htmlFor="content">
          본문
        </label>
        <textarea
          className={`${fieldClassName} min-h-[40rem] resize-y px-5 py-4 text-[1.08rem] leading-9`}
          id="content"
          name="content"
          placeholder="여기에 본문을 작성합니다."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={32}
        />
        <p className="text-keep text-sm leading-7 text-ink-muted">
          {characterCount}자 · 약 {readingMinutes}분 읽기
          {hasUnsavedChanges && !isPending ? " · 저장되지 않은 변경" : ""}
        </p>
        <FieldError message={fieldErrors.content} />
      </div>

      <AdminCollapsibleSection label="작성 가이드">
        <pre className="text-keep whitespace-pre-wrap text-sm leading-7 text-ink-muted">
          {WRITING_GUIDE}
        </pre>
      </AdminCollapsibleSection>

      <div>
        <label className={labelClassName} htmlFor="description">
          한 줄 소개
        </label>
        <textarea
          className={`${fieldClassName} min-h-[6rem] resize-y leading-8`}
          defaultValue={initialValues.description}
          id="description"
          name="description"
          placeholder="글의 요지를 한 줄로 적습니다."
          rows={3}
        />
        <FieldError message={fieldErrors.description} />
      </div>

      <div className={sectionPanelClassName}>
        <p className={sectionHeadingClassName}>출판 정보</p>

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
              type="text"
            />
            <FieldError message={fieldErrors.category} />
          </div>
        </div>

        <div>
          <label className={labelClassName} htmlFor="series_slug">
            연재
          </label>
          <select
            className={fieldClassName}
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
          <FieldError message={fieldErrors.series_slug} />
        </div>

        {selectedSeriesSlug ? (
          <div>
            <label className={labelClassName} htmlFor="series_order">
              연재 순서
            </label>
            <input
              className={fieldClassName}
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
        className="rounded border border-line bg-paper"
        contentClassName="space-y-10 px-5 pb-6"
        label="고급 설정"
      >
        <div>
          <label className={labelClassName} htmlFor="slug">
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
              className={fieldClassName}
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
            <FieldError message={fieldErrors.slug} />
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
                홈페이지 추천 글
              </label>
              <p className="text-keep mt-1 text-sm leading-7 text-ink-muted">
                홈페이지 주요 영역에 노출할 글로 추천합니다.
              </p>
            </div>
          </div>
      </AdminCollapsibleSection>

      <AdminCollapsibleSection label="미리보기">
        <div className="space-y-4">
          <p className="text-keep text-sm leading-7 text-ink-muted">
            저장 후 공개 화면에서 다시 확인할 수 있습니다.
          </p>
          <MarkdownPreview source={content} />
        </div>
      </AdminCollapsibleSection>

      <div className="mt-10 rounded border border-line px-5 py-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-2">
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
            <p className="text-keep text-sm leading-7 text-ink-muted">
              변경사항을 저장한 뒤 미리보기에서 공개 전 모습을 확인할 수 있습니다.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button
              className={secondaryButtonClassName}
              disabled={isPending}
              name="intent"
              ref={draftButtonRef}
              type="submit"
              value="draft"
            >
              {isPending ? "저장 중…" : "임시 저장"}
            </button>
            <button
              className={primaryButtonClassName}
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
        <div className="rounded border border-line bg-paper-muted px-5 py-5">
          <p className="text-keep text-base font-medium text-ink">글 관리</p>
          <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
            보관하거나 휴지통으로 옮기면 공개 서재에서 보이지 않습니다.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {currentStatus !== "archived" ? (
              <button
                className={secondaryButtonClassName}
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
              className={secondaryButtonClassName}
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
