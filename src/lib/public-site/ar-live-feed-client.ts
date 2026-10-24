"use client";
import type { ArLiveFeedEvent } from "@/lib/public-site/ar-live-feed-types";

export function subscribeArLiveFeed(
  _listener: (event: ArLiveFeedEvent) => void,
): () => void {
  return () => {};
}
