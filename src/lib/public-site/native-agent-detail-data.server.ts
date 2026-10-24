import type { PublicAgentCredential } from "@/lib/verification/public-agent-credential";
import type { NativeAgentScoreBreakdown } from "@/lib/public-site/native-agent-score";
import type { PublicTokenMarketViewModel } from "@/lib/public-site/market-view-model";
import type { OnchainAgentIntelligence } from "@/lib/onchain-agent-intelligence";
import type { AgentInstallInfo } from "@/lib/public-site/agent-install-command";
import type { AgentTalkTarget } from "@/lib/public-site/agent-talk-target";
import type { FairscalePublicAssessment } from "@/lib/fairscale/types";
import { buildDemoNativeAgentDetailData } from "@/lib/demo-store";

export type NativeAgentPublicEvent = {
  label: string;
  description: string;
  date: string;
  kind: "created" | "wallet" | "token" | "verification" | "fee" | "metadata" | "other";
};

export type AgentTokenSource = "pumpfun" | "metaplex" | "agentranking" | "unknown";

export type NativeAgentTokenSummary = {
  launchId: string;
  mint: string;
  symbol: string | null;
  name: string | null;
  imageUrl: string | null;
  network: string;
  source: AgentTokenSource;
  marketView: PublicTokenMarketViewModel | null;
};

export type NativeAgentCapability = {
  label: string;
  kind: "service" | "mcp" | "x402" | "sap" | "archetype" | "mode" | "inference" | "protocol";
};

export type NativeAgentSocialLink = {
  kind: "website" | "twitter" | "telegram" | "github";
  url: string;
};

export type NativeAgentDetailData = {
  id: number;
  agentId: number;
  chainId: number;
  name: string;
  profilePath: string;
  description: string;
  image: string;
  owner: string;
  isActive: boolean;
  isVerified: boolean;
  isSolanaDirectoryListed: boolean;
  credential: PublicAgentCredential;
  verifiedAt: string | null;
  solanaRegisteredAt: string | null;
  publicVerificationStatus: string;
  arVerificationStatus: string;
  chain: { chainId: number; name: string; shortName: string };
  listingRegistrySource: string;
  nativeScore: NativeAgentScoreBreakdown;
  agentWalletPublicKey: string | null;
  socials: NativeAgentSocialLink[];
  linkedTokens: NativeAgentTokenSummary[];
  capabilities: NativeAgentCapability[];
  events: NativeAgentPublicEvent[];
  onchain: OnchainAgentIntelligence;
  feeTotals: {
    totalFeesDistributedLamports: string;
    totalCreatorFeesLamports: string;
    totalArFeesLamports: string;
    lastDistributionAt: string | null;
  } | null;
  createdAt: string;
  lastActiveAt: string;
  fairscaleAssessment: FairscalePublicAssessment | null;
  talk: AgentTalkTarget;
  install: AgentInstallInfo;
};

export async function loadNativeAgentDetailData(
  chainId: number,
  agentId: number,
  requestedSlug?: string,
): Promise<NativeAgentDetailData> {
  return buildDemoNativeAgentDetailData(chainId, agentId, requestedSlug);
}
