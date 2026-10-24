/**
 * Chain configuration for ERC-8004 Identity Registry and block explorers.
 */

export interface ChainConfig {
  chainId: number;
  name: string;
  registryAddress: `0x${string}`;
  explorerBaseUrl: string;
  rpcUrl?: string;
}

export const CHAIN_CONFIGS: Record<number, ChainConfig> = {
  1: {
    chainId: 1,
    name: "Ethereum",
    registryAddress: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432" as `0x${string}`,
    explorerBaseUrl: "https://etherscan.io",
    rpcUrl: "https://eth.llamarpc.com",
  },
  11155111: {
    chainId: 11155111,
    name: "Sepolia",
    registryAddress: "0x8004A818BFB912233c491871b3d84c89A494BD9e" as `0x${string}`,
    explorerBaseUrl: "https://sepolia.etherscan.io",
    rpcUrl: "https://rpc.sepolia.org",
  },
  8453: {
    chainId: 8453,
    name: "Base",
    registryAddress: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432" as `0x${string}`,
    explorerBaseUrl: "https://basescan.org",
    rpcUrl: "https://mainnet.base.org",
  },
  84532: {
    chainId: 84532,
    name: "Base Sepolia",
    registryAddress: "0x8004A818BFB912233c491871b3d84c89A494BD9e" as `0x${string}`,
    explorerBaseUrl: "https://sepolia.basescan.org",
    rpcUrl: "https://sepolia.base.org",
  },
};

export const DEFAULT_CHAIN_ID = 11155111;

export function getChainConfig(chainId: number): ChainConfig | undefined {
  return CHAIN_CONFIGS[chainId];
}

export function getExplorerUrl(
  chainId: number,
  type: "address" | "tx" | "token",
  value: string
): string {
  const config = getChainConfig(chainId);
  if (!config) return value;

  switch (type) {
    case "address":
      return `${config.explorerBaseUrl}/address/${value}`;
    case "tx":
      return `${config.explorerBaseUrl}/tx/${value}`;
    case "token":
      return `${config.explorerBaseUrl}/token/${value}`;
    default:
      return value;
  }
}

export function getTokenExplorerUrl(
  chainId: number,
  registryAddress: string,
  agentId: number
): string {
  const config = getChainConfig(chainId);
  if (!config) return "#";
  return `${config.explorerBaseUrl}/token/${registryAddress}?a=${agentId}`;
}
