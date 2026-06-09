"use client";

import { useActionState, useEffect, useState } from "react";
import { submitScholarDnaAnalysis } from "@/app/(site)/scholar-dna/actions";
import {
  commentFieldClassName,
  commentLabelClassName,
} from "@/components/essay-comment-form";
import {
  scholarDnaActionIdleState,
  type ScholarDnaActionState,
} from "@/lib/scholar-dna-action-state";

const LOADING_MESSAGES = [
  "대표 연구 주제 분석 중",
  "연구 흐름 정리 중",
  "핵심 문제의식 추출 중",
  "학문 인생 스토리 작성 중",
  "연구 관심사 지도 작성 중",
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-keep mt-2 text-sm leading-6 text-ink-muted" role="alert">
      {message}
    </p>
  );
}

export function ScholarDnaForm() {
  const [state, formAction, isPending] = useActionState(
    submitScholarDnaAnalysis,
    scholarDnaActionIdleState satisfies ScholarDnaActionState,
  );
  const [loadingTick, setLoadingTick] = useState(0);

  useEffect(() => {
    if (!isPending) {
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingTick((tick) => tick + 1);
    }, 2200);

    return () => window.clearInterval(interval);
  }, [isPending]);

  const loadingMessage = isPending
    ? LOADING_MESSAGES[loadingTick % LOADING_MESSAGES.length]
    : null;

  return (
    <form action={formAction}>
      {state.status === "error" ? (
        <p
          className="text-keep mb-6 whitespace-pre-wrap text-sm leading-7 text-ink-muted"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      <div className="space-y-6">
        <div>
          <label className={commentLabelClassName} htmlFor="scholar-dna-name">
            이름 *
          </label>
          <input
            autoComplete="name"
            className={commentFieldClassName}
            disabled={isPending}
            id="scholar-dna-name"
            maxLength={80}
            name="name"
            required
            type="text"
          />
          <FieldError message={state.fieldErrors?.name} />
        </div>

        <div>
          <label
            className={commentLabelClassName}
            htmlFor="scholar-dna-affiliation"
          >
            소속/직함 *
          </label>
          <input
            className={commentFieldClassName}
            disabled={isPending}
            id="scholar-dna-affiliation"
            maxLength={120}
            name="affiliation"
            placeholder="예: ○○대학교 법학전문대학원 교수"
            required
            type="text"
          />
          <FieldError message={state.fieldErrors?.affiliation} />
        </div>

        <div>
          <label
            className={commentLabelClassName}
            htmlFor="scholar-dna-field-of-study"
          >
            전공 분야 *
          </label>
          <input
            className={commentFieldClassName}
            disabled={isPending}
            id="scholar-dna-field-of-study"
            maxLength={120}
            name="field_of_study"
            placeholder="예: 형법, 민법, 상법 등"
            required
            type="text"
          />
          <FieldError message={state.fieldErrors?.fieldOfStudy} />
        </div>

        <div>
          <label
            className={commentLabelClassName}
            htmlFor="scholar-dna-paper-title-1"
          >
            대표 논문 제목 1 *
          </label>
          <input
            className={commentFieldClassName}
            disabled={isPending}
            id="scholar-dna-paper-title-1"
            maxLength={300}
            name="paper_title_1"
            placeholder="예: ○○에 관한 연구"
            required
            type="text"
          />
          <FieldError message={state.fieldErrors?.paperTitle1} />
        </div>

        <div>
          <label
            className={commentLabelClassName}
            htmlFor="scholar-dna-paper-title-2"
          >
            대표 논문 제목 2
          </label>
          <input
            className={commentFieldClassName}
            disabled={isPending}
            id="scholar-dna-paper-title-2"
            maxLength={300}
            name="paper_title_2"
            type="text"
          />
          <FieldError message={state.fieldErrors?.paperTitle2} />
        </div>

        <div>
          <label
            className={commentLabelClassName}
            htmlFor="scholar-dna-paper-title-3"
          >
            대표 논문 제목 3
          </label>
          <input
            className={commentFieldClassName}
            disabled={isPending}
            id="scholar-dna-paper-title-3"
            maxLength={300}
            name="paper_title_3"
            type="text"
          />
          <FieldError message={state.fieldErrors?.paperTitle3} />
        </div>

        <div>
          <label
            className={commentLabelClassName}
            htmlFor="scholar-dna-recent-interest"
          >
            최근 관심 주제
          </label>
          <input
            className={commentFieldClassName}
            disabled={isPending}
            id="scholar-dna-recent-interest"
            maxLength={300}
            name="recent_interest"
            placeholder="예: AI와 법, 법정책, 법교육 등"
            type="text"
          />
          <FieldError message={state.fieldErrors?.recentInterest} />
        </div>
      </div>

      {isPending ? (
        <p
          aria-live="polite"
          className="text-keep mt-8 text-sm leading-7 text-ink-muted"
          role="status"
        >
          {loadingMessage}…
        </p>
      ) : null}

      <div className="mt-8 flex justify-end">
        <button
          className="min-h-11 rounded bg-accent px-6 py-3 text-sm font-medium text-paper transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "분석 중…" : "시작하기 →"}
        </button>
      </div>
    </form>
  );
}
