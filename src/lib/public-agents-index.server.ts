import type { TokenMarketSnapshot } from "@/lib/public-site/dexscreener";
import type { PublicAgentLinkedToken } from "@/lib/public-agent-token";
import type { PublicAgentCredential } from "@/lib/verification/public-agent-credential";
import { getAllDemoAgents, toPublicAgentIndexModel } from "@/lib/demo-store";

export type PublicAgentIndexModel = {
  readonly id: number;
  readonly agentId: number;
  readonly chainId: number;
  readonly name: string;
  readonly image: string;
  readonly description: string;
  readonly isVerified: boolean;
  readonly isPremiumVerified: boolean;
  readonly publicVerificationStatus: string;
  readonly arVerificationStatus: string | null;
  readonly ownerAccountVerified?: boolean;
  readonly credential: PublicAgentCredential;
  readonly isSolanaDirectoryListed: boolean;
  readonly agentRankScore: number | null;
  readonly listedAt: string | null;
  readonly lastActiveAt: string | null;
  readonly profileHref: string;
  readonly linkedToken: PublicAgentLinkedToken | null;
  readonly linkedTokenChain: "solana" | "robinhood" | null;
  readonly linkedTokenVenue: "PumpSwap" | "Metaplex" | "Robinhood" | null;
  readonly market: TokenMarketSnapshot | null;
  readonly launchCreatedAt: string | null;
  readonly totalFeesDistributedLamports: string | null;
  readonly buyCount: number;
  readonly sellCount: number;
};

export async function loadPublicAgentsIndex(limit = 500): Promise<PublicAgentIndexModel[]> {
  return getAllDemoAgents().slice(0, limit).map(toPublicAgentIndexModel);
}
