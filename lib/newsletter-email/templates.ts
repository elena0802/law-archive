export const NEWSLETTER_TEMPLATES = ["plain", "archive-digest"] as const;

export type NewsletterTemplate = (typeof NEWSLETTER_TEMPLATES)[number];

export const DEFAULT_NEWSLETTER_TEMPLATE: NewsletterTemplate = "archive-digest";

export function parseNewsletterTemplate(value: unknown): NewsletterTemplate {
  return value === "plain" ? "plain" : "archive-digest";
}

export function newsletterTemplateLabel(template: NewsletterTemplate) {
  return template === "archive-digest"
    ? "형사법 아카이브 Digest"
    : "기본 텍스트";
}
