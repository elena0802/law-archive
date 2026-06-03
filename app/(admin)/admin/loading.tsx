import { ArchiveStatePanel } from "@/components/system-state";

export default function AdminLoading() {
  return (
    <ArchiveStatePanel
      variant="admin"
      eyebrow="서재 관리"
      title="관리 화면을 불러오는 중입니다."
      supporting="잠시만 기다려 주세요."
    />
  );
}
