export type OnchainAgentEndpointRow = {
  readonly name: string;
  readonly endpoint: string;
  readonly version: string;
  readonly valid: boolean;
};

export type OnchainAgentIntelligence = {
  readonly registryStandard: string;
  readonly chainName: string;
  readonly chainShortName: string;
  readonly protocolAgentId: string;
  readonly agentUri: string | null;
  readonly explorerUrl: string | null;
  readonly sap: {
    readonly agentPda: string | null;
    readonly statsPda: string | null;
    readonly ownerWallet: string | null;
    readonly registrationTx: string | null;
    readonly registeredAt: string | null;
    readonly lastSyncedAt: string | null;
    readonly x402Endpoint: string | null;
    readonly protocols: readonly string[];
    readonly capabilities: readonly string[];
    readonly pricingTiers: readonly string[];
    readonly totalCalls: number | null;
  } | null;
  readonly metaplex: {
    readonly assetAddress: string | null;
    readonly identityPda: string | null;
    readonly assetSignerPda: string | null;
    readonly registrationUri: string | null;
    readonly tokenMint: string | null;
    readonly supportedTrust: readonly string[];
    readonly lastIndexedAt: string | null;
    readonly explorerUrl: string | null;
  } | null;
  readonly endpoints: readonly OnchainAgentEndpointRow[];
};
