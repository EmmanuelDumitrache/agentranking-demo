export const AGENT_LAUNCH_NETWORKS = ["devnet", "mainnet-beta"] as const;
export type AgentLaunchNetwork = (typeof AGENT_LAUNCH_NETWORKS)[number];

export function normalizeAgentLaunchNetwork(raw: string): AgentLaunchNetwork | null {
  const n = raw.trim().toLowerCase();
  if (n === "devnet") return "devnet";
  if (n === "mainnet-beta" || n === "mainnet") return "mainnet-beta";
  return null;
}

export function parseAgentLaunchNetwork(raw?: string | null): AgentLaunchNetwork {
  const normalized = normalizeAgentLaunchNetwork(raw?.trim() || "mainnet-beta");
  return normalized ?? "mainnet-beta";
}

export function isAgentLaunchNetwork(value: string): value is AgentLaunchNetwork {
  return normalizeAgentLaunchNetwork(value) != null;
}

export function resolveAgentLaunchRpcUrl(network: AgentLaunchNetwork): string {
  return network === "devnet"
    ? "https://api.devnet.solana.com"
    : "https://api.mainnet-beta.solana.com";
}

export function validateAgentLaunchRpcEnv(): string | null {
  return null;
}

export function solanaExplorerClusterParam(network: AgentLaunchNetwork): string | undefined {
  return network === "devnet" ? "devnet" : undefined;
}
