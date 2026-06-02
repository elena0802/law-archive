import Link from "next/link";

export default function AdminEssayNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-keep font-serif text-2xl text-ink">글을 찾을 수 없습니다</h1>
      <p className="text-keep mt-4 text-base leading-8 text-ink-muted">
        주소가 잘못되었거나 삭제된 글일 수 있습니다.
      </p>
      <Link
        className="mt-6 inline-block text-accent underline-offset-4 hover:underline"
        href="/admin/essays"
      >
        ← 글 목록
      </Link>
    </div>
  );
}
