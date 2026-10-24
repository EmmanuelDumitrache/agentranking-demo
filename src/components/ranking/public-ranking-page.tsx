"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bot, Plus } from "lucide-react";
import { AgentsIndexToolbar } from "@/components/public-site/agents-index-toolbar";
import { AgentMarketCard } from "@/components/public-site/agent-market-card";
import { PublicSitePanel } from "@/components/public-site/public-site-ui";
import type { PublicAgentIndexModel } from "@/lib/public-agents-index.server";
import {
  parsePublicRankingInput,
  type PublicRankingAgent,
  type PublicRankingInput,
  type PublicRankingPageData,
  type PublicRankingSummary,
} from "@/lib/ranking/public-ranking.server";
import {
  buildDemoRankingSummary,
  filterDemoRankingPage,
} from "@/lib/demo-store";

const integerFormatter = new Intl.NumberFormat("en-GB", {
  maximumFractionDigits: 0,
});

function formatInteger(value: number): string {
  return integerFormatter.format(Math.max(0, Math.round(value)));
}

function formatShare(part: number, whole: number): string {
  if (whole <= 0 || part <= 0) return "0%";
  const share = (part / whole) * 100;
  if (share > 0 && share < 0.1) return "<0.1%";
  return `${share.toFixed(share < 10 ? 1 : 0)}%`;
}

type CorpusSegment = {
  readonly id: string;
  readonly label: string;
  readonly count: number;
  readonly barClass: string;
  readonly swatchClass: string;
};

function rankingCorpusSegments(summary: PublicRankingSummary): CorpusSegment[] {
  const rankedOther = Math.max(0, summary.totalAgents - summary.rankedVerifiedAgents);
  return [
    {
      id: "verified",
      label: "Verified on list",
      count: summary.rankedVerifiedAgents,
      barClass: "ui-ranking-corpus-seg ui-ranking-corpus-seg--verified",
      swatchClass: "ui-ranking-corpus-swatch ui-ranking-corpus-swatch--verified",
    },
    {
      id: "ranked",
      label: "Listed / ranked",
      count: rankedOther,
      barClass: "ui-ranking-corpus-seg ui-ranking-corpus-seg--ranked",
      swatchClass: "ui-ranking-corpus-swatch ui-ranking-corpus-swatch--ranked",
    },
    {
      id: "unranked",
      label: "Indexed, not listed",
      count: summary.activeUnrankedAgents,
      barClass: "ui-ranking-corpus-seg ui-ranking-corpus-seg--unranked",
      swatchClass: "ui-ranking-corpus-swatch ui-ranking-corpus-swatch--unranked",
    },
    {
      id: "dead",
      label: "Dead / spam",
      count: summary.deadOrSpamAgents,
      barClass: "ui-ranking-corpus-seg ui-ranking-corpus-seg--dead",
      swatchClass: "ui-ranking-corpus-swatch ui-ranking-corpus-swatch--dead",
    },
  ];
}

function RankingCorpusBar({ summary }: { readonly summary: PublicRankingSummary }) {
  const indexed = summary.indexedAgents;
  const segments = rankingCorpusSegments(summary);
  const deadShare = formatShare(summary.deadOrSpamAgents, indexed);
  const visibleSegments = segments.filter((segment) => segment.count > 0);

  return (
    <PublicSitePanel>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.08em]">
            Full index
          </p>
          <p className="mt-1 text-2xl font-semibold leading-none tabular-nums sm:text-[1.75rem]">
            {formatInteger(indexed)}
            <span className="text-muted-foreground ml-1.5 text-sm font-normal">indexed</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {indexed > 0 ? (
            <p className="text-muted-foreground shrink-0 pb-0.5 text-[11px] tabular-nums sm:text-xs">
              {deadShare} dead
            </p>
          ) : null}
          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Agent
          </Link>
        </div>
      </div>

      <div
        className="ui-ranking-corpus-track"
        role="img"
        aria-label={`Index mix: ${segments
          .map((segment) => `${formatInteger(segment.count)} ${segment.label}`)
          .join(", ")}`}
      >
        {indexed > 0 && visibleSegments.length > 0 ? (
          visibleSegments.map((segment) => (
            <span
              key={segment.id}
              className={segment.barClass}
              style={{ flexGrow: segment.count, flexBasis: 0 }}
              title={`${segment.label}: ${formatInteger(segment.count)}`}
            />
          ))
        ) : (
          <span className="ui-ranking-corpus-seg ui-ranking-corpus-seg--dead flex-1" />
        )}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((segment) => (
          <li
            key={segment.id}
            className="text-muted-foreground flex items-center gap-1.5 text-[11px] tabular-nums sm:text-xs"
          >
            <span className={segment.swatchClass} aria-hidden />
            <span>
              <span className="text-foreground font-medium">{formatInteger(segment.count)}</span>{" "}
              {segment.label}
            </span>
          </li>
        ))}
      </ul>
    </PublicSitePanel>
  );
}

function rankingAgentToCardModel(agent: PublicRankingAgent): PublicAgentIndexModel {
  if (agent.card) return agent.card;
  return {
    id: agent.id,
    agentId: agent.agentId,
    chainId: 8453,
    name: agent.name,
    image: agent.image,
    description: agent.description,
    isVerified: agent.verified,
    isPremiumVerified: false,
    publicVerificationStatus: agent.verified ? "verified" : "unverified",
    arVerificationStatus: agent.verified ? "verified" : null,
    credential: { present: false },
    isSolanaDirectoryListed: false,
    agentRankScore: agent.arScore > 0 ? agent.arScore : null,
    listedAt: null,
    lastActiveAt: agent.lastActiveAt,
    profileHref: agent.profilePath,
    linkedToken: null,
    linkedTokenChain: null,
    linkedTokenVenue: null,
    market: null,
    launchCreatedAt: null,
    totalFeesDistributedLamports: null,
    buyCount: 0,
    sellCount: 0,
  };
}

function AgentsIndexSignals({ summary }: { readonly summary: PublicRankingSummary }) {
  const items = [
    { label: "Listed", value: formatInteger(summary.totalAgents) },
    { label: "Verified", value: formatInteger(summary.verifiedAgents) },
    { label: "x402", value: formatInteger(summary.x402Agents) },
    { label: "MPP", value: formatInteger(summary.mppAgents) },
    { label: "Chains", value: formatInteger(summary.totalChains) },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
      aria-label="Directory signals"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="ui-stat-card flex flex-col items-center justify-center py-3 text-center"
        >
          <p className="ui-stat-value !mt-0">{item.value}</p>
          <p className="ui-stat-label mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

function PublicRankingClientInner({
  fallbackInput,
}: {
  readonly fallbackInput: PublicRankingInput;
}) {
  const searchParams = useSearchParams();
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const onUpdate = () => setRefreshTick((t) => t + 1);
    window.addEventListener("agentranking:demo-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("agentranking:demo-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const liveInput = useMemo<PublicRankingInput>(() => {
    if (!searchParams || [...searchParams.keys()].length === 0) {
      return fallbackInput;
    }
    return parsePublicRankingInput({
      q: searchParams.get("q") ?? undefined,
      chain: searchParams.get("chain") ?? undefined,
      verified: searchParams.get("verified") ?? undefined,
      x402: searchParams.get("x402") ?? undefined,
      mpp: searchParams.get("mpp") ?? undefined,
    });
  }, [fallbackInput, searchParams]);

  const summary = useMemo(() => buildDemoRankingSummary(), []);
  const resolvedData = useMemo(() => {
    void refreshTick;
    return filterDemoRankingPage(liveInput);
  }, [liveInput, refreshTick]);

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <RankingCorpusBar summary={summary} />
        <AgentsIndexSignals summary={summary} />
        <AgentsIndexToolbar
          key={liveInput.query}
          query={liveInput.query}
          chainId={liveInput.chainId}
          verifiedOnly={liveInput.verifiedOnly}
          x402Only={liveInput.x402Only}
          mppOnly={liveInput.mppOnly}
          chains={summary.chains}
        />
      </div>

      {resolvedData.agents.length === 0 ? (
        <PublicSitePanel className="px-4 py-16 text-center sm:px-5">
          <Bot className="text-muted-foreground mx-auto h-8 w-8" aria-hidden />
          <h2 className="mt-3 text-sm font-semibold">No agents match these filters</h2>
          <p className="text-muted-foreground mx-auto mt-1 max-w-md text-xs">
            Try a shorter search query or reset filters to view all ranked agents.
          </p>
          <Link
            href="/agents"
            className="mt-4 inline-flex rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-muted/50"
          >
            Reset filters
          </Link>
        </PublicSitePanel>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resolvedData.agents.map((agent) => (
            <AgentMarketCard
              key={`${agent.id}-${agent.rank}`}
              agent={rankingAgentToCardModel(agent)}
              badge={agent.chain.shortName}
              subtitle={agent.chain.name}
              rank={agent.rank}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function PublicRankingPage({
  input,
}: {
  readonly input: PublicRankingInput;
  readonly data?: Promise<PublicRankingPageData> | PublicRankingPageData;
  readonly summary?: Promise<PublicRankingSummary> | PublicRankingSummary;
}) {
  return (
    <Suspense fallback={<div className="ui-panel h-[12rem] animate-pulse" />}>
      <PublicRankingClientInner fallbackInput={input} />
    </Suspense>
  );
}
