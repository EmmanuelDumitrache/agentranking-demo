export type AccountVerificationLevel = "NONE" | "INDIVIDUAL" | "BUSINESS";
export type AccountVerificationStatus =
  | "UNVERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | "EXPIRED";

export type AgentLaunch = {
  id: string;
  agentId: string;
  agentDbId?: number | null;
  mint: string | null;
  network: string;
  creatorWallet: string;
  arTreasuryWallet?: string | null;
  tokenName: string | null;
  tokenSymbol: string | null;
  tokenDescription: string | null;
  tokenImageUrl: string | null;
  metadataUri?: string | null;
  metadataJson?: unknown;
  passportJson?: unknown;
  profileDisplayName?: string | null;
  profileShortDescription?: string | null;
  profileLongDescription?: string | null;
  profileAvatarUrl?: string | null;
  profileBannerUrl?: string | null;
  profileWebsite?: string | null;
  profileTwitter?: string | null;
  profileTelegram?: string | null;
  profileGithub?: string | null;
  profileTags?: string[];
  archetype?: string | null;
  launchStatus: string;
  launchLifecycleStatus?: string | null;
  launchKind?: string | null;
  feeSharingStatus: string;
  creatorShareBps: number;
  arShareBps: number;
  creationTx?: string | null;
  totalFeesDistributedLamports?: bigint | number | string;
  totalCreatorFeesLamports?: bigint | number | string;
  totalArFeesLamports?: bigint | number | string;
  lastDistributionAt?: Date | null;
  arTokenVerificationStatus?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export namespace Prisma {
  export type AgentGetPayload<_T> = Record<string, unknown>;
}
