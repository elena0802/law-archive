import { siteConfig } from "@/lib/site";

const DEFAULT_NEWSLETTER_FROM_EMAIL = "contact@jurachun.com";

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function getNewsletterFromEmail() {
  const fromEnv =
    process.env.NEWSLETTER_FROM_EMAIL?.trim() ||
    process.env.NEWSLETTER_FROM?.trim();

  return fromEnv || DEFAULT_NEWSLETTER_FROM_EMAIL;
}

export function getNewsletterFromAddress() {
  return `${siteConfig.name} <${getNewsletterFromEmail()}>`;
}
