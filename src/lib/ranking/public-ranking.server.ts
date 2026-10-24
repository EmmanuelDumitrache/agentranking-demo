import { buildAgentsIndexHref } from "@/lib/ranking/agents-index-href";
import type { PublicAgentIndexModel } from "@/lib/public-agents-index.server";
import {
  buildDemoRankingSummary,
  filterDemoRankingPage,
} from "@/lib/demo-store";

export type PublicRankingSearchParams = Record<
  string,
  string | string[] | undefined
>;

export type PublicRankingDirection = "after" | "before";

export type PublicRankingCursor = {
  readonly version: 1;
  readonly rank: number;
  readonly id: number;
};

export type PublicRankingInput = {
  readonly query: string;
  readonly chainId: number | null;
  readonly verifiedOnly: boolean;
  readonly x402Only: boolean;
  readonly mppOnly: boolean;
  readonly direction: PublicRankingDirection;
  readonly cursor: PublicRankingCursor | null;
};

export type PublicRankingAgent = {
  readonly id: number;
  readonly rank: number;
  readonly agentId: number;
  readonly name: string;
  readonly image: string;
  readonly description: string;
  readonly lastActiveAt: string | null;
  readonly profilePath: string;
  readonly arScore: number;
  readonly trustLabel: "Verified" | "Low" | "Medium" | "High";
  readonly totalFeedback: number;
  readonly x402Support: boolean;
  readonly verified: boolean;
  readonly protocol: string;
  readonly chain: {
    readonly name: string;
    readonly shortName: string;
  };
  readonly card?: PublicAgentIndexModel;
};

export type PublicRankingPageData = {
  readonly agents: PublicRankingAgent[];
  readonly hasPrevious: boolean;
  readonly hasNext: boolean;
  readonly previousCursor: string | null;
  readonly nextCursor: string | null;
  readonly generatedAt: string;
};

export type PublicRankingChain = {
  readonly chainId: number;
  readonly name: string;
  readonly shortName: string;
  readonly agentCount: number;
};

export type PublicRankingSummary = {
  readonly totalAgents: number;
  readonly verifiedAgents: number;
  readonly totalChains: number;
  readonly x402Agents: number;
  readonly mppAgents: number;
  readonly indexedAgents: number;
  readonly rankedVerifiedAgents: number;
  readonly activeUnrankedAgents: number;
  readonly deadOrSpamAgents: number;
  readonly chains: PublicRankingChain[];
};

function firstParam(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? "";
  return "";
}

function parseTruthyFlag(value: string | string[] | undefined): boolean {
  const normalized = firstParam(value).trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

export function parsePublicRankingInput(
  params: PublicRankingSearchParams = {},
): PublicRankingInput {
  const query = firstParam(params.q).trim().slice(0, 120);
  const rawChain = Number.parseInt(firstParam(params.chain).trim(), 10);
  const chainId = Number.isFinite(rawChain) && rawChain !== 0 ? rawChain : null;
  return {
    query,
    chainId,
    verifiedOnly: parseTruthyFlag(params.verified),
    x402Only: parseTruthyFlag(params.x402),
    mppOnly: parseTruthyFlag(params.mpp),
    direction: "after",
    cursor: null,
  };
}

export function buildPublicRankingHref(
  current: PublicRankingInput,
  patch?: {
    readonly query?: string;
    readonly chainId?: number | null;
    readonly verifiedOnly?: boolean;
    readonly x402Only?: boolean;
    readonly mppOnly?: boolean;
    readonly after?: string | null;
    readonly before?: string | null;
  },
): string {
  return buildAgentsIndexHref({
    query: patch?.query ?? current.query,
    chainId: patch?.chainId !== undefined ? patch.chainId : current.chainId,
    verifiedOnly: patch?.verifiedOnly ?? current.verifiedOnly,
    x402Only: patch?.x402Only ?? current.x402Only,
    mppOnly: patch?.mppOnly ?? current.mppOnly,
    after: patch?.after ?? null,
    before: patch?.before ?? null,
  });
}

export async function readPublicRankingSummary(): Promise<PublicRankingSummary> {
  return buildDemoRankingSummary();
}

export async function readPublicRankingPage(
  input: PublicRankingInput,
): Promise<PublicRankingPageData> {
  return filterDemoRankingPage(input);
}
