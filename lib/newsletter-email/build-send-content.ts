import "server-only";

import type { NewsletterEmailVariant } from "@/lib/newsletter-email/footer";
import { loadArchiveDigestSourceData } from "@/lib/newsletter-email/archive-digest-source";
import {
  buildNewsletterEmailContent,
  type NewsletterEmailContent,
} from "@/lib/newsletter-email/template";
import { buildArchiveDigestEmailContent } from "@/lib/newsletter/templates/archive-digest";
import type { NewsletterTemplate } from "@/lib/newsletter-email/templates";
import { getSiteOrigin } from "@/lib/site";

export type { NewsletterTemplate } from "@/lib/newsletter-email/templates";
export {
  DEFAULT_NEWSLETTER_TEMPLATE,
  NEWSLETTER_TEMPLATES,
  newsletterTemplateLabel,
  parseNewsletterTemplate,
} from "@/lib/newsletter-email/templates";

export async function buildNewsletterSendContent({
  template,
  subject,
  message,
  relatedUrl,
  unsubscribeUrl,
  variant,
}: {
  template: NewsletterTemplate;
  subject: string;
  message: string;
  relatedUrl: string | null;
  unsubscribeUrl?: string | null;
  variant: NewsletterEmailVariant;
}): Promise<NewsletterEmailContent> {
  if (template === "plain") {
    return buildNewsletterEmailContent({
      subject,
      message,
      relatedUrl,
      unsubscribeUrl,
      variant,
    });
  }

  const siteOrigin = getSiteOrigin();
  const source = await loadArchiveDigestSourceData(relatedUrl, siteOrigin);

  return buildArchiveDigestEmailContent({
    subject,
    introMessage: message,
    featuredEssay: source.featuredEssay,
    curationItems: source.curationItems,
    siteOrigin,
    unsubscribeUrl,
    variant,
  });
}
