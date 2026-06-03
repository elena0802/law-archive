import { redirect } from "next/navigation";
import type { EssaySaveNotice } from "@/lib/admin/admin-notices";

/** HTTP headers and Next.js redirect digests require Latin-1–safe query values. */
const ASCII_QUERY_VALUE = /^[\x21-\x7E]+$/;

function assertAsciiQueryValue(name: string, value: string) {
  if (!ASCII_QUERY_VALUE.test(value)) {
    throw new Error(
      `Admin redirect query "${name}" must be ASCII-only (got non-Latin-1 character).`,
    );
  }
}

export function redirectAdminEssayEdit(
  essayId: string,
  notice: EssaySaveNotice,
): never {
  assertAsciiQueryValue("id", essayId);
  assertAsciiQueryValue("notice", notice);
  const search = new URLSearchParams({ notice }).toString();
  const target = `/admin/essays/${essayId}?${search}`;
  console.error("[redirectAdminEssayEdit] before redirect", {
    essayId,
    notice,
    target,
    targetLength: target.length,
  });
  redirect(target);
}

export function redirectAdminEssaysList(options?: {
  status?: "deleted";
  notice?: EssaySaveNotice;
}): never {
  const search = new URLSearchParams();

  if (options?.status) {
    assertAsciiQueryValue("status", options.status);
    search.set("status", options.status);
  }

  if (options?.notice) {
    assertAsciiQueryValue("notice", options.notice);
    search.set("notice", options.notice);
  }

  const qs = search.toString();
  redirect(qs ? `/admin/essays?${qs}` : "/admin/essays");
}
