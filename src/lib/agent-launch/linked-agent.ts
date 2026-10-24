import type { PublicAgentCredential } from "@/lib/verification/public-agent-credential";

export type LaunchLinkedAgentSummary = {
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
  readonly profileHref: string;
  readonly chainName: string;
  readonly chainShortName: string;
};
