import type { serializeAgentLaunch } from "@/lib/agent-launch/serialize";
import type { resolveLaunchDisplayProfile } from "@/lib/agent-launch/launch-profile";
import type { AgentPassport } from "@/lib/agent-launch/passport";
import type { LaunchLinkedAgentSummary } from "@/lib/agent-launch/linked-agent";
import type { TokenMarketSnapshot } from "@/lib/public-site/dexscreener";
import type { TokenCardSocials } from "@/lib/public-site/token-card-market";
import type { TokenGraduationDisplay } from "@/lib/public-site/token-graduation";
import type { RobinhoodLaunchRecord } from "@/lib/robinhood-chain/types";
import { buildDemoTokenDiscoveryCards } from "@/lib/demo-store";

export type LaunchIndexCardModel = {
  launch: ReturnType<typeof serializeAgentLaunch>;
  profile: ReturnType<typeof resolveLaunchDisplayProfile>;
  tokenImageUrl: string | null;
  passport: AgentPassport | null;
  linkedAgent: LaunchLinkedAgentSummary | null;
  capabilityBadges: string[];
  lifecycleLabel: string;
  buyCount: number;
  sellCount: number;
  totalDistributedLabel: string;
  creatorShareLabel: string;
  arShareLabel: string;
  market: TokenMarketSnapshot | null;
  socials: TokenCardSocials;
  graduation: TokenGraduationDisplay | null;
};

export type TokenDiscoveryCardModel = {
  chain: "solana" | "robinhood";
  id: string;
  tokenSymbol: string | null;
  tokenName: string | null;
  tokenImageUrl: string | null;
  detailHref: string;
  createdAt: string;
  linkedAgent: LaunchLinkedAgentSummary | null;
  market: TokenMarketSnapshot | null;
  socials: TokenCardSocials;
  launch?: LaunchIndexCardModel;
  rh?: RobinhoodLaunchRecord;
  sourceVerified?: boolean;
  sourceLabel?: string;
  graduation: TokenGraduationDisplay | null;
};

export async function loadLaunchIndexCards(): Promise<LaunchIndexCardModel[]> {
  return buildDemoTokenDiscoveryCards()
    .map((c) => c.launch)
    .filter((l): l is LaunchIndexCardModel => Boolean(l));
}

export async function loadAllLaunchIndexCards(): Promise<TokenDiscoveryCardModel[]> {
  return buildDemoTokenDiscoveryCards();
}
