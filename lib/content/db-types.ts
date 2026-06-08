/**
 * Supabase row shapes for PR11 CMS tables.
 * @see design/PR11-CMS-ARCHITECTURE.md §3
 */

export type EssayStatus = "draft" | "published" | "archived" | "deleted";
export type SeriesStatus = "active" | "hidden";

export type SeriesRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  introduction: string;
  display_order: number;
  status: SeriesStatus;
  created_at: string;
  updated_at: string;
};

export type EssayRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  essay_date: string;
  category: string;
  series_slug: string | null;
  series_order: number | null;
  status: EssayStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type EssayInsert = {
  title: string;
  slug: string;
  description: string;
  content: string;
  essay_date: string;
  category: string;
  series_slug: string | null;
  series_order?: number | null;
  status: EssayStatus;
  featured: boolean;
  published_at?: string | null;
};

export type EssayUpdate = Partial<EssayInsert & { published_at: string | null }>;

export type CommentStatus = "pending" | "approved" | "rejected";

export type CommentRow = {
  id: string;
  essay_slug: string;
  parent_id: string | null;
  author_name: string | null;
  author_affiliation: string | null;
  content: string;
  status: CommentStatus;
  password_hash: string | null;
  created_at: string;
  updated_at: string;
};

export type CommentInsert = {
  essay_slug: string;
  parent_id?: string | null;
  author_name?: string | null;
  author_affiliation?: string | null;
  content: string;
  status?: CommentStatus;
  password_hash?: string | null;
};

export type GuestbookEntryStatus = "pending" | "approved" | "rejected";

export type GuestbookEntryRow = {
  id: string;
  name: string;
  affiliation: string | null;
  content: string;
  password_hash: string | null;
  status: GuestbookEntryStatus;
  reply_content: string | null;
  replied_at: string | null;
  replied_by: string | null;
  created_at: string;
  updated_at: string;
};

export type GuestbookEntryInsert = {
  name: string;
  affiliation?: string | null;
  content: string;
  status?: GuestbookEntryStatus;
  password_hash?: string | null;
  reply_content?: string | null;
  replied_at?: string | null;
  replied_by?: string | null;
};

export type NewsletterSubscriberStatus = "active" | "unsubscribed";

export type NewsletterSubscriberRow = {
  id: string;
  email: string;
  status: NewsletterSubscriberStatus;
  source: string | null;
  unsubscribe_token: string;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type NewsletterSubscriberInsert = {
  email: string;
  status?: NewsletterSubscriberStatus;
  source?: string | null;
  unsubscribe_token?: string;
};

export type NewsletterSendRow = {
  id: string;
  subject: string;
  body: string;
  related_url: string | null;
  recipient_count: number;
  success_count: number;
  failure_count: number;
  sent_at: string;
  created_by: string;
};

export type NewsletterSendInsert = {
  subject: string;
  body: string;
  related_url?: string | null;
  recipient_count: number;
  success_count: number;
  failure_count: number;
  sent_at?: string;
  created_by: string;
};
