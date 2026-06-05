import type { Metadata } from "next";
import { GuestbookEntryList } from "@/components/guestbook-entry-list";
import { GuestbookForm } from "@/components/guestbook-form";
import { Section } from "@/components/section";
import {
  isGuestbookAvailable,
  listApprovedGuestbookEntries,
  type GuestbookEntry,
} from "@/lib/guestbook";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "안부의 글",
  description:
    "오랜 동료, 제자, 법조인, 독자 여러분의 안부와 생각을 남기는 공간입니다.",
  alternates: {
    canonical: "/guestbook",
  },
  openGraph: {
    title: `안부의 글 | ${siteConfig.name}`,
    description:
      "오랜 동료, 제자, 법조인, 독자 여러분의 안부와 생각을 남기는 공간입니다.",
    url: "/guestbook",
    locale: "ko_KR",
    siteName: siteConfig.name,
  },
};

export default async function GuestbookPage() {
  const guestbookAvailable = isGuestbookAvailable();
  let entries: GuestbookEntry[] = [];
  let loadFailed = false;

  if (guestbookAvailable) {
    try {
      entries = await listApprovedGuestbookEntries();
    } catch (error) {
      console.error("Failed to load guestbook entries:", error);
      loadFailed = true;
    }
  }

  return (
    <Section size="reading" className="py-page">
      <header>
        <p className="mb-6 text-sm tracking-[0.18em] text-accent uppercase">
          안부의 글
        </p>
        <h1 className="text-keep font-serif text-4xl leading-[1.12] text-ink sm:text-5xl">
          안부의 글
        </h1>
        <p className="text-keep mt-7 text-lg leading-9 text-ink-muted">
          오랜 동료, 제자, 법조인, 독자 여러분의 안부와 생각을 남겨주세요.
        </p>
      </header>

      {!guestbookAvailable ? (
        <p className="text-keep mt-10 text-base leading-8 text-ink-muted">
          안부의 글 기능을 사용할 수 없습니다.
        </p>
      ) : (
        <>
          <div className="mt-14">
            <GuestbookForm />
          </div>

          <section aria-labelledby="guestbook-entries-heading" className="mt-14">
            <h2
              className="text-xs tracking-[0.14em] text-accent uppercase"
              id="guestbook-entries-heading"
            >
              남겨진 안부
            </h2>
            {loadFailed ? (
              <p className="text-keep mt-6 text-base leading-8 text-ink-muted">
                안부를 불러오지 못했습니다.
              </p>
            ) : (
              <GuestbookEntryList entries={entries} />
            )}
          </section>
        </>
      )}
    </Section>
  );
}
