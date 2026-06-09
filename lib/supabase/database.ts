import type {
  CommentInsert,
  CommentRow,
  EssayInsert,
  EssayRow,
  EssayStatus,
  EssayUpdate,
  GuestbookEntryInsert,
  GuestbookEntryRow,
  NewsletterSendInsert,
  NewsletterSendRow,
  NewsletterSubscriberInsert,
  NewsletterSubscriberRow,
  ScholarDnaAnalysisInsert,
  ScholarDnaAnalysisRow,
  SeriesRow,
} from "@/lib/content/db-types";

type SeriesInsert = Omit<SeriesRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

type SeriesUpdate = Partial<SeriesInsert>;

/**
 * Hand-written Supabase schema types for PR11.
 * @see design/PR11-CMS-ARCHITECTURE.md
 */
export type Database = {
  public: {
    Tables: {
      series: {
        Row: SeriesRow;
        Insert: SeriesInsert;
        Update: SeriesUpdate;
        Relationships: [];
      };
      essays: {
        Row: EssayRow;
        Insert: EssayInsert;
        Update: EssayUpdate;
        Relationships: [
          {
            foreignKeyName: "essays_series_slug_fkey";
            columns: ["series_slug"];
            isOneToOne: false;
            referencedRelation: "series";
            referencedColumns: ["slug"];
          },
        ];
      };
      comments: {
        Row: CommentRow;
        Insert: CommentInsert;
        Update: Partial<CommentInsert>;
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
        ];
      };
      guestbook_entries: {
        Row: GuestbookEntryRow;
        Insert: GuestbookEntryInsert;
        Update: Partial<GuestbookEntryInsert>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriberRow;
        Insert: NewsletterSubscriberInsert;
        Update: Partial<NewsletterSubscriberInsert>;
        Relationships: [];
      };
      newsletter_sends: {
        Row: NewsletterSendRow;
        Insert: NewsletterSendInsert;
        Update: Partial<NewsletterSendInsert>;
        Relationships: [];
      };
      scholar_dna_analyses: {
        Row: ScholarDnaAnalysisRow;
        Insert: ScholarDnaAnalysisInsert;
        Update: Partial<ScholarDnaAnalysisInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      essay_status: EssayStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
