import type {
  NewsletterSubscriberRow,
  NewsletterSubscriberStatus,
} from "@/lib/content/db-types";
import { requireEditorSupabase } from "@/lib/admin/require-editor";
import { formatAdminDateTime } from "@/lib/admin/essays";
import { buildNewsletterUnsubscribeUrl } from "@/lib/newsletter";
import { isResendConfigured } from "@/lib/newsletter-email/config";
import { isSupabaseServiceRoleConfigured } from "@/lib/supabase/config";
import { requireSupabaseServiceRoleClient } from "@/lib/supabase/server";

export type AdminNewsletterSubscriber = {
  id: string;
  email: string;
  status: NewsletterSubscriberStatus;
  source: string | null;
  unsubscribeToken: string;
  unsubscribedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewsletterStats = {
  total: number;
  active: number;
  unsubscribed: number;
};

function mapSubscriberRow(row: NewsletterSubscriberRow): AdminNewsletterSubscriber {
  return {
    id: row.id,
    email: row.email,
    status: row.status,
    source: row.source,
    unsubscribeToken: row.unsubscribe_token,
    unsubscribedAt: row.unsubscribed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function newsletterStatusLabel(status: NewsletterSubscriberStatus) {
  switch (status) {
    case "active":
      return "활성";
    case "unsubscribed":
      return "해지";
    default:
      return status;
  }
}

export function formatNewsletterSource(source: string | null) {
  const trimmed = source?.trim();
  return trimmed ? trimmed : "—";
}

export function isAdminNewsletterAvailable() {
  return isSupabaseServiceRoleConfigured();
}

export function isNewsletterDeliveryConfigured() {
  return isResendConfigured();
}

export type ActiveSubscriberUnsubscribeLookup = {
  isActiveSubscriber: boolean;
  unsubscribeUrl: string | null;
};

export async function lookupActiveSubscriberUnsubscribe(
  email: string,
): Promise<ActiveSubscriberUnsubscribeLookup> {
  await requireEditorSupabase();
  const supabase = requireSupabaseServiceRoleClient();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return { isActiveSubscriber: false, unsubscribeUrl: null };
  }

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("status, unsubscribe_token")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error || !data) {
    return { isActiveSubscriber: false, unsubscribeUrl: null };
  }

  if (data.status !== "active") {
    return { isActiveSubscriber: false, unsubscribeUrl: null };
  }

  const token = data.unsubscribe_token?.trim();
  if (!token) {
    return { isActiveSubscriber: true, unsubscribeUrl: null };
  }

  return {
    isActiveSubscriber: true,
    unsubscribeUrl: buildNewsletterUnsubscribeUrl(token),
  };
}

export async function getNewsletterSubscribers(): Promise<AdminNewsletterSubscriber[]> {
  await requireEditorSupabase();
  const supabase = requireSupabaseServiceRoleClient();

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load newsletter subscribers: ${error.message}`);
  }

  return (data ?? []).map(mapSubscriberRow);
}

export async function getNewsletterStats(): Promise<NewsletterStats> {
  await requireEditorSupabase();
  const supabase = requireSupabaseServiceRoleClient();

  const [totalResult, activeResult, unsubscribedResult] = await Promise.all([
    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "unsubscribed"),
  ]);

  if (totalResult.error) {
    throw new Error(
      `Failed to count newsletter subscribers: ${totalResult.error.message}`,
    );
  }

  if (activeResult.error) {
    throw new Error(
      `Failed to count active subscribers: ${activeResult.error.message}`,
    );
  }

  if (unsubscribedResult.error) {
    throw new Error(
      `Failed to count unsubscribed subscribers: ${unsubscribedResult.error.message}`,
    );
  }

  return {
    total: totalResult.count ?? 0,
    active: activeResult.count ?? 0,
    unsubscribed: unsubscribedResult.count ?? 0,
  };
}

function escapeCsvField(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export function buildNewsletterSubscribersCsv(
  subscribers: AdminNewsletterSubscriber[],
) {
  const header = "email,status,source,created_at";
  const rows = subscribers.map((subscriber) =>
    [
      escapeCsvField(subscriber.email),
      escapeCsvField(subscriber.status),
      escapeCsvField(subscriber.source ?? ""),
      escapeCsvField(subscriber.createdAt),
    ].join(","),
  );

  return [header, ...rows].join("\n");
}

export async function exportNewsletterSubscribersCsv(): Promise<string> {
  const subscribers = await getNewsletterSubscribers();
  return buildNewsletterSubscribersCsv(subscribers);
}

export { formatAdminDateTime };
