import type { CommentRow } from "@/lib/content/db-types";

export const MAX_COMMENT_DEPTH = 3;

export type Comment = {
  id: string;
  essaySlug: string;
  parentId: string | null;
  authorName: string | null;
  authorAffiliation: string | null;
  content: string;
  status: CommentRow["status"];
  createdAt: string;
  updatedAt: string;
  authorDeleteSupported: boolean;
};

export type CommentThread = Comment & {
  replies: CommentThread[];
};
