export type StreamflowPoolConfigDto = Readonly<{
  poolAddress: string;
  stakeMint: string;
  underlyingMint: string;
  constraints: Readonly<{ min: string; max: string }>;
  decimals: number;
  fetchedAt: string;
}>;

export const DEFAULT_STREAMFLOW_STAKE_POOL =
  "Dx2XPveijG6n3UpM3kEB4ZcYLZvSzrJLiCBMER36Xe6S" as const;
export const DEFAULT_STREAMFLOW_STAKE_POOL_MINT =
  "5BiP6MEkhsLX538aPdpjaHNMg3Yqxb9eznR7AzhFekt7" as const;

export function streamflowStakePoolDefaults(): { stakePool: string; stakePoolMint: string } {
  return {
    stakePool: DEFAULT_STREAMFLOW_STAKE_POOL,
    stakePoolMint: DEFAULT_STREAMFLOW_STAKE_POOL_MINT,
  };
}

export function resolveStreamflowSolanaNetwork(): string {
  return "mainnet-beta";
}

export function streamflowRpcEndpoint(): string {
  return "https://api.mainnet-beta.solana.com";
}

export function streamflowPublicClusterRpcEndpoint(): string {
  return "https://api.mainnet-beta.solana.com";
}

export function stakingPageSolanaClusterLabel(): string {
  return "Mainnet";
}

export function solanaExplorerTxUrl(signature: string): string {
  return `https://solscan.io/tx/${signature.trim()}`;
}

export const DEFAULT_PUBLIC_STREAMFLOW_STAKE_POOLS = [
  "53AJ6WCBy1nRsxD4sVgwcp9WJp5touTBj3nhpe1ZcBKa",
  "5dNpPLZdmpGT1htDm3x45bAeTWpqyuZE7zLcM6piSKPC",
  "EbGkrgtrcPTcXe3ATgrZUm9yEG8XHRPzyqFFyEsvYdVh",
  "HHLhtB4EpqebCbpw1X3DZjfQMK4Erdj5VKXeWfNzUSR9",
] as const;

export function publicStreamflowStakePoolAddresses(): string[] {
  return [...DEFAULT_PUBLIC_STREAMFLOW_STAKE_POOLS];
}

export const DEFAULT_AR_BONUS_REWARDS_VAULT =
  "HkiQhgVnmFepz6pcdnuF5iKUqDnqJpXiLTi3wKePxxDq" as const;

export const DEFAULT_STREAMFLOW_REWARD_VAULT_OWNERS = [
  "4GEbnR6nXCovZkEzzZtVVDZ3dmTLPnztpg2fTUkymfuk",
  "2p1tc6xYfaFCAGLv2GobEiCZXoXvz37t1yNexAKKFoJ7",
  "6rqabUFuJgg3oC7CbUSNsSPuyA7mNe9a3HtUAdTgYMfM",
  "4vd2Keq9XbJCVANMK1GAVDoTgqXqtJd81xbqGhhGpjpB",
] as const;

export function resolveArBonusRewardsVault(): string {
  return DEFAULT_AR_BONUS_REWARDS_VAULT;
}

export function streamflowRewardVaultOwners(): string[] {
  return [...DEFAULT_STREAMFLOW_REWARD_VAULT_OWNERS];
}

export function allowedStreamflowStakePools(): { poolAddress: string; mintAddress: string } | null {
  return {
    poolAddress: DEFAULT_STREAMFLOW_STAKE_POOL,
    mintAddress: DEFAULT_STREAMFLOW_STAKE_POOL_MINT,
  };
}

export function firstFreeStakeNonce(used: readonly number[]): number | null {
  const taken = new Set(used);
  for (let nonce = 0; nonce < 256; nonce++) {
    if (!taken.has(nonce)) return nonce;
  }
  return null;
}

export function isAllowlistedStakePool(): boolean {
  return true;
}
