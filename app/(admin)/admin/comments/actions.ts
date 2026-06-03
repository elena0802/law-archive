"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteAdminComment,
  setAdminCommentStatus,
} from "@/lib/admin/comments";
import type { CommentStatus } from "@/lib/content/db-types";

function parseReturnStatus(value: FormDataEntryValue | null): CommentStatus | "all" {
  const status = String(value ?? "");

  if (status === "approved" || status === "pending" || status === "rejected") {
    return status;
  }

  return "all";
}

function redirectToComments(returnStatus: CommentStatus | "all") {
  if (returnStatus === "all") {
    redirect("/admin/comments");
  }

  redirect(`/admin/comments?status=${returnStatus}`);
}

async function revalidateEssayComments(essaySlug: string | null) {
  if (essaySlug) {
    revalidatePath(`/essays/${essaySlug}`);
  }
}

export async function approveComment(commentId: string, formData: FormData) {
  const returnStatus = parseReturnStatus(formData.get("return_status"));
  const essaySlug = await setAdminCommentStatus(commentId, "approved");
  await revalidateEssayComments(essaySlug);
  redirectToComments(returnStatus);
}

export async function rejectComment(commentId: string, formData: FormData) {
  const returnStatus = parseReturnStatus(formData.get("return_status"));
  const essaySlug = await setAdminCommentStatus(commentId, "rejected");
  await revalidateEssayComments(essaySlug);
  redirectToComments(returnStatus);
}

export async function deleteComment(commentId: string, formData: FormData) {
  const returnStatus = parseReturnStatus(formData.get("return_status"));
  const essaySlug = await deleteAdminComment(commentId);
  await revalidateEssayComments(essaySlug);
  redirectToComments(returnStatus);
}
