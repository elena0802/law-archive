import { AboutSection } from "@/components/about-section";

const CONTACT_EMAIL = "jurachun@dau.ac.kr";

export function AboutContactSection() {
  return (
    <AboutSection heading="문의" id="contact">
      <p className="text-keep">
        이 아카이브와 관련한 강연, 원고, 인터뷰, 연구 문의는 아래 주소로 연락해
        주시기 바랍니다.
      </p>
      <p className="text-keep mt-5">
        <a
          aria-label={`이메일로 문의: ${CONTACT_EMAIL}`}
          className="text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href={`mailto:${CONTACT_EMAIL}`}
        >
          {CONTACT_EMAIL}
        </a>
      </p>
    </AboutSection>
  );
}
