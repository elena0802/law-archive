"use client";

import { useActionState } from "react";
import {
  sendMagicLink,
  type LoginActionState,
} from "@/app/(admin)/admin/login/actions";

const initialState: LoginActionState = { status: "idle" };

type LoginFormProps = {
  errorMessage?: string;
};

export function LoginForm({ errorMessage }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(
    sendMagicLink,
    initialState,
  );

  const bannerMessage =
    state.status === "sent" || state.status === "error"
      ? state.message
      : errorMessage;

  const bannerTone =
    state.status === "sent"
      ? "border-line bg-paper-muted text-ink"
      : "border-line bg-paper-muted text-ink-muted";

  return (
    <form action={formAction} className="mt-10 space-y-6">
      {bannerMessage ? (
        <p
          className={`text-keep rounded border px-4 py-3 text-base leading-7 ${bannerTone}`}
          role={state.status === "error" || errorMessage ? "alert" : "status"}
        >
          {bannerMessage}
        </p>
      ) : null}

      <div>
        <label
          className="text-keep block text-base font-medium text-ink"
          htmlFor="email"
        >
          이메일
        </label>
        <p className="text-keep mt-2 text-sm leading-7 text-ink-muted">
          등록된 주소로 로그인 링크를 보냅니다. 비밀번호는 사용하지 않습니다.
        </p>
        <input
          autoComplete="email"
          className="mt-4 w-full rounded border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30"
          id="email"
          name="email"
          placeholder="name@example.com"
          required
          type="email"
        />
      </div>

      <button
        className="w-full rounded border border-accent bg-accent px-4 py-3 text-base font-medium text-paper transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending || state.status === "sent"}
        type="submit"
      >
        {isPending ? "보내는 중…" : "로그인 링크 받기"}
      </button>
    </form>
  );
}
