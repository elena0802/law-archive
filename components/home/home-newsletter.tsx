import { HomeNewsletterForm } from "@/components/home/home-newsletter-form";
import { HomeSectionHeader } from "@/components/home/home-section-header";

export function HomeNewsletter() {
  return (
    <section aria-labelledby="home-newsletter-heading">
      <HomeSectionHeader
        description="새로운 글, 연재, 연구 노트를 이메일로 받아보실 수 있습니다."
        headingId="home-newsletter-heading"
        title="뉴스레터"
      />
      <HomeNewsletterForm />
    </section>
  );
}
