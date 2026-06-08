import { lookupActiveSubscriberUnsubscribe } from "@/lib/admin/newsletter";
import { requireEditorSupabase } from "@/lib/admin/require-editor";
import { sendOneNewsletterEmail } from "@/lib/newsletter-email/send-one";
import { buildNewsletterTestEmailContent } from "@/lib/newsletter-email/template";
import {
  validateNewsletterSendFields,
  type NewsletterSendFieldErrors,
} from "@/lib/newsletter-email/validate";

export type SendNewsletterTestEmailInput = {
  recipientEmail: string;
  subject: string;
  message: string;
  relatedUrl?: string;
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

  const content = buildNewsletterTestEmailContent({
    subject: validated.subject,
    message: validated.message,
    relatedUrl: validated.relatedUrl,
    unsubscribeUrl,
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
