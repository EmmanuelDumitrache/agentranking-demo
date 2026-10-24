"use client";

import type { SerializedAgentLaunch } from "@/components/agent-launch/types";
import type { TokenLaunchFormFields } from "@/lib/agent-launch/token-launch-utils";
export type { TokenLaunchFormFields } from "@/lib/agent-launch/token-launch-utils";
export {
  mapTokenLaunchError,
  validateTokenLaunchForm,
} from "@/lib/agent-launch/token-launch-utils";

export type LaunchProgressPhase =
  | "idle"
  | "draft"
  | "details"
  | "metadata"
  | "preparing"
  | "signing"
  | "sending"
  | "confirming"
  | "create"
  | "routing"
  | "syncing"
  | "done"
  | "error";

function buildMockSerializedLaunch(
  id: string,
  fields?: Partial<TokenLaunchFormFields & { creatorWallet?: string; mint?: string | null }>,
): SerializedAgentLaunch {
  const now = new Date().toISOString();
  const mint =
    fields?.mint ||
    `AR${Math.random().toString(36).slice(2, 10).toUpperCase()}7xKXtg2CW87d97TXJSDpbD5jBkheTqpump`;
  return {
    id,
    agentId: "101",
    agentDbId: 101,
    creatorWallet: fields?.creatorWallet || "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    arTreasuryWallet: "92eXvBFGBAXwgmPf6t6CUCNJH2xChsCJuWzaGPjyPUmP",
    agentWalletPublic: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    mint,
    tokenName: fields?.tokenName || "Demo Agent Token",
    tokenSymbol: fields?.tokenSymbol || "AGENT",
    tokenDescription: fields?.tokenDescription || "Launched on AgentRanking Demo",
    tokenImageUrl: fields?.tokenImageUrl || "/ar-mark.png",
    metadataUri: `https://ipfs.io/ipfs/bafkreidemo${id}`,
    metadataJson: null,
    passportJson: null,
    profileDisplayName: fields?.tokenName || "Demo Agent Token",
    profileShortDescription: fields?.tokenDescription || "Launched on AgentRanking Demo",
    profileLongDescription: fields?.tokenDescription || "Launched on AgentRanking Demo",
    profileAvatarUrl: fields?.tokenImageUrl || "/ar-mark.png",
    profileBannerUrl: null,
    profileWebsite: fields?.website || null,
    profileTwitter: fields?.twitter || null,
    profileTelegram: fields?.telegram || null,
    profileGithub: null,
    profileTags: ["AI Agent", "ERC-8004"],
    archetype: "autonomous_agent",
    network: "mainnet-beta",
    launchStatus: "indexed",
    launchLifecycleStatus: "indexed",
    launchKind: "pumpfun",
    feeSharingStatus: "active",
    sharingConfigAddress: null,
    creatorShareBps: 9000,
    arShareBps: 1000,
    creationSignature: `5DemoSig${Date.now().toString(36)}`,
    feeShareSignature: `5DemoFeeSig${Date.now().toString(36)}`,
    totalFeesDistributedLamports: "1450000000",
    totalCreatorFeesLamports: "1305000000",
    totalArFeesLamports: "145000000",
    lastDistributionAt: now,
    arTokenVerificationStatus: "verified",
    errorMessage: null,
    createdAt: now,
    updatedAt: now,
  } as unknown as SerializedAgentLaunch;
}

export async function fetchLaunchDraft(draftId: string) {
  return {
    launch: buildMockSerializedLaunch(draftId),
    recovered: false,
    recoveredMint: null,
  };
}

export async function createLaunchDraft(
  _agentId: string,
  creatorWallet: string,
): Promise<SerializedAgentLaunch> {
  return buildMockSerializedLaunch(`demo-${Date.now()}`, { creatorWallet });
}

export async function patchLaunchDraft(
  launchId: string,
  fields: Partial<TokenLaunchFormFields & { creatorWallet?: string }>,
): Promise<SerializedAgentLaunch> {
  return buildMockSerializedLaunch(launchId, fields);
}

export async function publishLaunchMetadata(
  launchId: string,
  imagePlaceholder: string,
  proposedMint?: string | null,
): Promise<SerializedAgentLaunch> {
  return buildMockSerializedLaunch(launchId, {
    tokenImageUrl: imagePlaceholder,
    mint: proposedMint ?? undefined,
  });
}

export async function createPumpTokenOnChain(
  launch: SerializedAgentLaunch,
  creatorWallet: string,
  mintKeypair: { publicKey: { toBase58: () => string } },
  _agentDbId: number,
  onPhase?: (phase: LaunchProgressPhase) => void,
): Promise<SerializedAgentLaunch> {
  onPhase?.("signing");
  await new Promise((r) => setTimeout(r, 350));
  onPhase?.("confirming");
  await new Promise((r) => setTimeout(r, 350));
  return {
    ...launch,
    creatorWallet,
    mint: mintKeypair.publicKey.toBase58(),
    launchStatus: "token_created",
  };
}

export async function activatePumpFeeRouting(
  launch: SerializedAgentLaunch,
): Promise<SerializedAgentLaunch> {
  await new Promise((r) => setTimeout(r, 250));
  return {
    ...launch,
    launchStatus: "indexed",
    feeSharingStatus: "active",
  };
}
