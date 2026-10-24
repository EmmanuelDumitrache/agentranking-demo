"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSourceDraft } from "@/hooks/use-source-draft";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ArLiveFeedEvent } from "@/lib/public-site/ar-live-feed-types";
import { cn, timeAgo } from "@/lib/utils";

const MOBILE_QUERY = "(max-width: 639px)";
const MAX_ITEMS = 5;

const DEMO_FEED_EVENTS: ArLiveFeedEvent[] = [
  {
    id: "demo-feed-1",
    kind: "verified",
    title: "Tokyo Alpha Sentinel verified on AgentRanking (KYB Tier 3)",
    href: "/agents/8453/888/tokyo-alpha-sentinel",
    occurredAt: new Date(Date.now() - 2 * 60_000).toISOString(),
    chain: "robinhood",
  },
  {
    id: "demo-feed-2",
    kind: "buy",
    title: "14.5 SOL buy on $AIXBT · PumpSwap",
    href: "/tokens/DemoMintAIXBT1111111111111111111111111111111",
    occurredAt: new Date(Date.now() - 6 * 60_000).toISOString(),
    chain: "solana",
  },
  {
    id: "demo-feed-3",
    kind: "agent_launch",
    title: "AIXBT v2 updated ERC-8004 MCP endpoint",
    href: "/agents/8453/101/aixbt-v2",
    occurredAt: new Date(Date.now() - 14 * 60_000).toISOString(),
    chain: "robinhood",
  },
  {
    id: "demo-feed-4",
    kind: "token_launch",
    title: "$GENESIS launched via Metaplex Genesis",
    href: "/tokens/DemoMintGenesis99999999999999999999999999999",
    occurredAt: new Date(Date.now() - 28 * 60_000).toISOString(),
    chain: "solana",
  },
  {
    id: "demo-feed-5",
    kind: "fees",
    title: "4.82 SOL creator fee payout distributed to $ZEREBRO",
    href: "/tokens/DemoMintZerebro44444444444444444444444444444",
    occurredAt: new Date(Date.now() - 45 * 60_000).toISOString(),
    chain: "solana",
  },
];

function kindTone(kind: ArLiveFeedEvent["kind"]): string {
  switch (kind) {
    case "buy":
      return "border-emerald-500/35 bg-emerald-500/10 text-emerald-300";
    case "sell":
      return "border-rose-500/35 bg-rose-500/10 text-rose-300";
    case "token_launch":
      return "border-violet-500/30 bg-violet-500/10 text-violet-200";
    case "agent_launch":
      return "border-border/60 bg-muted/30 text-foreground/80";
    case "fees":
      return "border-amber-500/35 bg-amber-500/10 text-amber-200";
    case "verified":
      return "border-sky-500/35 bg-sky-500/10 text-sky-200";
    case "milestone":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-200";
    case "digest":
      return "border-border/50 bg-muted/20 text-foreground/75";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function kindLabel(kind: ArLiveFeedEvent["kind"]): string {
  switch (kind) {
    case "buy":
      return "Buy";
    case "sell":
      return "Sell";
    case "token_launch":
      return "Token";
    case "agent_launch":
      return "Agent";
    case "fees":
      return "Fees";
    case "verified":
      return "Verified";
    case "milestone":
      return "Milestone";
    case "digest":
      return "Stats";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function ArLiveFeedWidget() {
  const [items, setItems] = useState<ArLiveFeedEvent[]>(DEMO_FEED_EVENTS.slice(0, MAX_ITEMS));
  const hydrated = useHydrated();
  const mobile = useMediaQuery(MOBILE_QUERY);
  const [expanded, setExpanded] = useSourceDraft(mobile ? "mobile" : "desktop", !mobile);

  useEffect(() => {
    if (!hydrated || !expanded) return;
    const handleDemoUpdate = () => {
      try {
        const raw = window.localStorage.getItem("agentranking_demo_custom_agents_v1");
        if (!raw) return;
        const parsed = JSON.parse(raw) as Array<{
          chainId: number;
          agentId: number;
          name: string;
          createdAt: string;
        }>;
        const latest = parsed[0];
        if (!latest) return;
        const slug = latest.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        const customEvent: ArLiveFeedEvent = {
          id: `custom-${latest.chainId}-${latest.agentId}`,
          kind: "agent_launch",
          title: `${latest.name} registered on-chain (#${latest.agentId})`,
          href: `/agents/${latest.chainId}/${latest.agentId}/${slug || "agent"}`,
          occurredAt: latest.createdAt || new Date().toISOString(),
          chain: latest.chainId === 900 ? "solana" : "robinhood",
        };
        setItems((prev) => [
          customEvent,
          ...prev.filter((item) => item.id !== customEvent.id),
        ].slice(0, MAX_ITEMS));
      } catch {
        // Ignore storage parse errors
      }
    };
    handleDemoUpdate();
    window.addEventListener("agentranking:demo-updated", handleDemoUpdate);
    return () => window.removeEventListener("agentranking:demo-updated", handleDemoUpdate);
  }, [expanded, hydrated]);

  return (
    <div
      className={cn(
        "pointer-events-auto fixed z-40 w-[min(100vw-1.5rem,20rem)]",
        "bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))]",
      )}
    >
      <div className="overflow-hidden rounded-lg border border-border/60 bg-[linear-gradient(180deg,var(--app-panel-raised)_0%,var(--app-panel)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-[12px]">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-muted/20"
          aria-expanded={expanded}
        >
          <Image
            src="/ar-mark.png"
            alt=""
            width={22}
            height={22}
            className="h-5 w-5 shrink-0 object-contain"
            aria-hidden
          />
          <span className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight">
            AR Live Feed
          </span>
          <span
            className={cn(
              "inline-flex h-2 w-2 shrink-0 rounded-full",
              expanded ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground/40",
            )}
            aria-hidden
          />
          {expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          ) : (
            <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          )}
        </button>
        {expanded ? (
          <div className="border-t border-border/50">
            <ul className="max-h-[min(50vh,18rem)] space-y-1.5 overflow-y-auto p-2 no-scrollbar">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-md border px-2.5 py-2 transition-opacity hover:opacity-90",
                      kindTone(item.kind),
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 text-xs font-semibold leading-snug text-foreground">
                        {item.title}
                      </p>
                      <span className="shrink-0 text-[10px] uppercase tracking-wide text-foreground/55">
                        {kindLabel(item.kind)}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] text-foreground/55">
                      {timeAgo(item.occurredAt)}
                      {" · "}
                      {item.chain === "robinhood" ? "EVM" : "Solana"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
