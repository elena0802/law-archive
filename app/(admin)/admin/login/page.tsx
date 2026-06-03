import type { Metadata } from "next";
import { LoginForm } from "@/app/(admin)/admin/login/login-form";
import { ADMIN_LOGIN_CONFIG_ERROR } from "@/lib/admin/admin-messages";

export const metadata: Metadata = {
  title: "로그인",
};

const errorMessages: Record<string, string> = {
  config: ADMIN_LOGIN_CONFIG_ERROR,
  not_allowed: "등록된 관리자만 이 서재를 편집할 수 있습니다.",
  auth:
    "로그인에 실패했습니다. 링크가 만료되었을 수 있습니다. 다시 시도해 주세요.",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : undefined;

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <p className="text-sm tracking-[0.18em] text-accent uppercase">로그인</p>
      <h1 className="text-keep mt-4 font-serif text-3xl leading-tight text-ink">
        서재 관리
      </h1>
      <p className="text-keep mt-5 text-base leading-8 text-ink-muted">
        글을 쓰고 공개하려면 이메일로 받은 링크를 눌러 주세요. 이 화면은
        관리자만 사용합니다.
      </p>
      <LoginForm errorMessage={errorMessage} />
    </div>
  );
}
