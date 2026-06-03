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
import { flushSync } from "react-dom";
import { EssayStatusSelector } from "@/components/admin/essay-status-selector";
import { AdminNoticeBanner } from "@/components/admin/admin-notice-banner";
import { PublishConfirmDialog } from "@/components/admin/publish-confirm-dialog";
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
  series: Pick<SeriesRow, "slug" | "title">[];
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
  essay_status: EssayStatus;
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
  const statusValue =
    formData.get("essay_status") ?? formData.get("current_status");
  const essay_status =
    statusValue === "published" ||
    statusValue === "archived" ||
    statusValue === "deleted"
      ? statusValue
      : "draft";

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
    essay_status,
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
    a.featured === b.featured &&
    a.essay_status === b.essay_status
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
  slugLocked,
  action,
  noticeMessage,
}: EssayFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    essayActionIdleState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const publishConfirmedRef = useRef(false);
  const [content, setContent] = useState(initialValues.content);
  const [essayStatus, setEssayStatus] = useState<EssayStatus>(currentStatus);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
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
      essay_status: essayStatus,
    }),
    [essayStatus, initialValues],
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

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      const isPublishing =
        essayStatus === "published" && currentStatus !== "published";

      if (isPublishing && !publishConfirmedRef.current) {
        event.preventDefault();
        setPublishConfirmOpen(true);
        return;
      }

      publishConfirmedRef.current = false;
      beginSubmit();
    },
    [beginSubmit, currentStatus, essayStatus],
  );

  const handlePublishConfirm = useCallback(() => {
    setPublishConfirmOpen(false);
    publishConfirmedRef.current = true;
    flushSync(() => {
      setEssayStatus("published");
    });
    beginSubmit();
    formRef.current?.requestSubmit();
  }, [beginSubmit]);

  const handlePublishCancel = useCallback(() => {
    setPublishConfirmOpen(false);
  }, []);

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
      <input name="essay_status" type="hidden" value={essayStatus} />

      {noticeMessage ? <AdminNoticeBanner message={noticeMessage} /> : null}

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
          <label className={labelClassName} htmlFor="series_order">
            연재 순서
          </label>
          <input
            className={fieldClassName}
            defaultValue={
              initialValues.series_order === null
                ? ""
                : String(initialValues.series_order)
            }
            id="series_order"
            inputMode="numeric"
            min={1}
            name="series_order"
            placeholder="예: 1"
            type="number"
          />
          <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
            연재 안에서 읽히는 순서입니다. 비워두면 제목 번호를 기준으로
            정렬됩니다.
          </p>
        </div>
      </div>

      <div className="grid gap-10 sm:grid-cols-2">
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
          {characterCount}자 · 약 {readingMinutes}분 읽기
          {hasUnsavedChanges && !isPending ? " · 저장되지 않은 변경" : ""}
        </p>
        <p className="text-keep text-sm leading-7 text-ink-muted">
          평소 글쓰기처럼 작성하시면 됩니다.
        </p>
        <div className="rounded border border-line bg-paper-muted px-4 py-4">
          <p className="text-sm tracking-[0.12em] text-accent uppercase">
            작성 가이드
          </p>
          <pre className="text-keep mt-3 whitespace-pre-wrap text-sm leading-7 text-ink-muted">{`# 큰 제목
## 소제목
- 목록
> 인용문
---
구분선`}</pre>
        </div>
        <textarea
          className={`${fieldClassName} min-h-[40rem] resize-y px-5 py-4 text-[1.08rem] leading-9`}
          id="content"
          name="content"
          placeholder="여기에 본문을 작성합니다."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={32}
        />
        <FieldError message={fieldErrors.content} />
      </div>

      <div className="space-y-3 rounded border border-line bg-paper-muted px-5 py-5">
        <p className="text-sm tracking-[0.12em] text-accent uppercase">
          미리보기
        </p>
        <MarkdownPreview source={content} />
      </div>

      <div className="border-t border-line border-dashed pt-10">
        <EssayStatusSelector
          onStatusChange={setEssayStatus}
          selectedStatus={essayStatus}
        />
      </div>

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
              변경사항을 저장한 뒤 미리보기에서 공개 전 모습을 확인할 수 있습니다.
            </p>
          </div>
          <div className="shrink-0">
            <button
              className={primaryButtonClassName}
              disabled={isPending}
              name="intent"
              type="submit"
              value="save"
            >
              {isPending
                ? "저장 중…"
                : mode === "create"
                  ? "글 저장"
                  : "변경 저장"}
            </button>
          </div>
        </div>
      </div>

      <PublishConfirmDialog
        onCancel={handlePublishCancel}
        onConfirm={handlePublishConfirm}
        open={publishConfirmOpen}
      />
    </form>
  );
}
