import {
  NewsletterAlreadyUnsubscribedPanel,
  NewsletterInvalidTokenPanel,
  NewsletterUnsubscribeErrorPanel,
  NewsletterUnsubscribeSuccessPanel,
} from "@/components/newsletter-feedback-panels";
import { unsubscribeFromNewsletterByToken } from "@/lib/newsletter";

type NewsletterTokenUnsubscribeResultProps = {
  token: string;
};

export async function NewsletterTokenUnsubscribeResult({
  token,
}: NewsletterTokenUnsubscribeResultProps) {
  const result = await unsubscribeFromNewsletterByToken(token);

  if (result.ok) {
    return <NewsletterUnsubscribeSuccessPanel />;
  }

  if (result.code === "already_unsubscribed") {
    return <NewsletterAlreadyUnsubscribedPanel />;
  }

  if (result.code === "invalid_token" || result.code === "not_found") {
    return <NewsletterInvalidTokenPanel />;
  }

  return <NewsletterUnsubscribeErrorPanel message={result.error} />;
}
