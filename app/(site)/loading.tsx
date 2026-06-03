import { ArchiveStatePanel } from "@/components/system-state";

export default function SiteLoading() {
  return (
    <ArchiveStatePanel
      variant="public"
      eyebrow="서재"
      title="서재를 불러오는 중입니다."
      supporting="잠시만 기다려 주세요."
    />
  );
}
