export type WhatsNewEntry = {
  id: string;
  date: string;
  title: string;
  body: string;
};

/** Newest first. Bump `id` when shipping a new entry so the unread blue dot returns. */
export const WHATS_NEW_ENTRIES: readonly WhatsNewEntry[] = [
  {
    id: "2026-08-16-creator-flow-refresh",
    date: "2026-08-16",
    title: "Creator flow and launchpad refresh",
    body:
      "Create-agent wizard now has clearer five-step guidance, drag-and-drop avatars, and a richer review screen with account verification and post-create routing. The launchpad separates chain and protocol selection (Solana, Pump.fun, Metaplex, Robinhood Chain) with a balanced mobile layout and drag-and-drop token images. Account sidebar controls add name privacy masking and an in-app profile editor.",
  },
  {
    id: "2026-08-16-agent-profile-editing",
    date: "2026-08-16",
    title: "Agent profile editing and versions",
    body:
      "Edit public agent profiles from Overview or Settings with a quick edit shortcut. Publish profile changes and version notes from the Social page, with clearer toasts and overview-style panels.",
  },
  {
    id: "2026-08-16-chat-and-import",
    date: "2026-08-16",
    title: "Faster chat and safer agent import",
    body:
      "New chat opens instantly when you are already in chat, with a cleaner composer (plus attach, send icon, subtle focus glow). Import agent config now rejects secrets more accurately and supports JSON file upload with an improved migration prompt.",
  },
  {
    id: "2026-08-13-register-launch-polish",
    date: "2026-08-13",
    title: "Register on Solana, creator fees, and launch polish",
    body:
      "Register lists your agent on the Solana public directory (~0.01 SOL network fee, free on AgentRanking). Tokenized agents also get an AgentRanking identity stamp. When registered, look for the fingerprint badge next to your agent name — sidebar, overview, and public profile.",
  },
  {
    id: "2026-08-07-schedule",
    date: "2026-08-07",
    title: "Agent Schedule",
    body:
      "Each agent now has a Schedule tab under Agent in the sidebar. Set up to five recurring tasks — prompts, reports, and more — on hourly, daily, or weekly timing.",
  },
] as const;

export const WHATS_NEW_LATEST_ID = WHATS_NEW_ENTRIES[0]?.id ?? "";

export const WHATS_NEW_SEEN_STORAGE_KEY = "ar.whatsNew.seenId";

export function isWhatsNewUnread(seenId: string | null | undefined): boolean {
  if (!WHATS_NEW_LATEST_ID) return false;
  return (seenId ?? "") !== WHATS_NEW_LATEST_ID;
}
