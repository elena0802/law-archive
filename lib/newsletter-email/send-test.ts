import { lookupActiveSubscriberUnsubscribe } from "@/lib/admin/newsletter";
import { requireEditorSupabase } from "@/lib/admin/require-editor";
import { buildNewsletterSendContent } from "@/lib/newsletter-email/build-send-content";
import { sendOneNewsletterEmail } from "@/lib/newsletter-email/send-one";
import type { NewsletterTemplate } from "@/lib/newsletter-email/templates";
import {
  validateNewsletterSendFields,
  type NewsletterSendFieldErrors,
} from "@/lib/newsletter-email/validate";

export type SendNewsletterTestEmailInput = {
  recipientEmail: string;
  subject: string;
  message: string;
  relatedUrl?: string;
  template?: NewsletterTemplate;
};

export type SendNewsletterTestEmailResult =
  | {
      ok: true;
      messageId: string;
      includedUnsubscribeLink: boolean;
      isActiveSubscriber: boolean;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: NewsletterSendFieldErrors;
    };

export async function sendNewsletterTestEmail(
  input: SendNewsletterTestEmailInput,
): Promise<SendNewsletterTestEmailResult> {
  await requireEditorSupabase();

  const validated = validateNewsletterSendFields({
    subject: input.subject,
    message: input.message,
    relatedUrl: input.relatedUrl,
    template: input.template,
    recipientEmail: input.recipientEmail,
    requireRecipient: true,
  });

  if (!validated.ok) {
    return {
      ok: false,
      error: validated.error,
      fieldErrors: validated.fieldErrors,
    };
  }

  const recipientEmail = input.recipientEmail.trim().toLowerCase();

  const { isActiveSubscriber, unsubscribeUrl } =
    await lookupActiveSubscriberUnsubscribe(recipientEmail);

  const content = await buildNewsletterSendContent({
    template: validated.template,
    subject: validated.subject,
    message: validated.message,
    relatedUrl: validated.relatedUrl,
    unsubscribeUrl,
    variant: "test",
  });

  const result = await sendOneNewsletterEmail({
    to: recipientEmail,
    content,
  });

  if (!result.ok) {
    return {
      ok: false,
      error: result.error,
    };
  }

  return {
    ok: true,
    messageId: result.messageId,
    includedUnsubscribeLink: Boolean(unsubscribeUrl),
    isActiveSubscriber,
  };
}
