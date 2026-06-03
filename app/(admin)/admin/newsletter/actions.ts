"use server";

import { exportNewsletterSubscribersCsv } from "@/lib/admin/newsletter";

export async function downloadNewsletterSubscribersCsv() {
  return exportNewsletterSubscribersCsv();
}
