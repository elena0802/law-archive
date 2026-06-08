"use client";

import { sendGAEvent } from "@next/third-parties/google";

const isGaEnabled =
  process.env.NODE_ENV === "production" &&
  Boolean(process.env.NEXT_PUBLIC_GA_ID?.trim());

export type GaCustomEvent =
  | "guestbook_created"
  | "comment_created"
  | "newsletter_subscribed"
  | "search_used";

export function trackGaEvent(
  eventName: GaCustomEvent,
  params?: Record<string, string | number | boolean>,
) {
  if (!isGaEnabled) {
    return;
  }

  sendGAEvent("event", eventName, params ?? {});
}
