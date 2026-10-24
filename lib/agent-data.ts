import { getChainConfig, DEFAULT_CHAIN_ID } from "./chains";
import type { AgentMetadata } from "./agent-metadata-resolver";
import { getDeterministicAgentMetrics } from "./mock-data";
import type { CreatedAgent } from "@/stores/created-agents-store";

export interface AgentData {
  agentId: number;
  chainId: number;
  chainName: string;
  registry: string;
  owner: string;
  agentWallet: string;
  agentURI: string;
  metadata: AgentMetadata;
  createdTx?: string;
  createdAt?: number;
}

function encodeBase64Json(obj: object): string {
  const json = JSON.stringify(obj);
  if (typeof Buffer !== "undefined") {
    return Buffer.from(json, "utf-8").toString("base64");
  }
  return btoa(
    encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(Number.parseInt(p1, 16))
    )
  );
}

export function getMockAgentData(chainId: number, agentId: number): AgentData {
  const deterministic = getDeterministicAgentMetrics(agentId);
  const resolvedChainId = deterministic.chains[0] === "Ethereum" ? 1 : chainId || DEFAULT_CHAIN_ID;
  const config = getChainConfig(resolvedChainId);
  const chainName = config?.name ?? deterministic.chains[0] ?? "Sepolia";
  const registry =
    config?.registryAddress ?? "0x8004A818BFB912233c491871b3d84c89A494BD9e";

  const services = [
    {
      name: deterministic.protocol,
      endpoint: deterministic.endpoint,
      version: deterministic.protocol === "MCP" ? "2025-06-18" : "0.8.0",
      skills: deterministic.skills,
      domains: deterministic.domains,
    },
    {
      name: "web",
      endpoint: `https://agent-${agentId}.8004scanner.ai`,
    },
  ];

  const tags = [
    ...deterministic.categories.map((c) => c.toLowerCase()),
    ...deterministic.skills.map((s) => s.toLowerCase()),
  ];

  const supportedTrust =
    deterministic.trustMethod === "Hybrid"
      ? ["reputation", "crypto-economic", "tee-attestation"]
      : deterministic.trustMethod === "On-chain"
        ? ["reputation", "crypto-economic"]
        : ["reputation"];

  const metadataPayload = {
    type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
    name: deterministic.name,
    description: deterministic.description,
    image: `https://api.dicebear.com/7.x/shapes/png?seed=agent-${agentId}`,
    services,
    tags,
    supportedTrust,
    active: true,
    x402Support: deterministic.hasX402,
    updatedAt: Math.floor(deterministic.lastActive / 1000),
  };

  return {
    agentId,
    chainId: resolvedChainId,
    chainName,
    registry,
    owner: deterministic.owner,
    agentWallet: deterministic.paymentAddress ?? deterministic.owner,
    agentURI: `data:application/json;base64,${encodeBase64Json(metadataPayload)}`,
    metadata: metadataPayload,
    createdAt: Math.floor(deterministic.createdAt / 1000),
  };
}

export function createdAgentToAgentData(c: CreatedAgent): AgentData {
  const config = getChainConfig(c.chainId);
  const chainName = c.chainName ?? config?.name ?? "Sepolia";
  const registry =
    c.registry ||
    config?.registryAddress ||
    "0x8004A818BFB912233c491871b3d84c89A494BD9e";
  const owner = `0x${(c.agentId * 987654321).toString(16).padStart(40, "c").slice(0, 40)}`;

  const services =
    c.services && c.services.length > 0
      ? c.services.map((s) => ({
          name: s.name,
          endpoint: s.endpoint,
          version: s.version,
          skills: s.skills,
          domains: s.domains,
        }))
      : [
          {
            name: "MCP",
            endpoint: c.endpoint || `https://agent-${c.agentId}.8004scanner.ai/mcp`,
            version: "2025-06-18",
          },
        ];

  const metadataPayload: AgentMetadata = {
    name: c.name || `Agent #${c.agentId}`,
    description:
      c.description ||
      `${c.name} is an ERC-8004 AI agent registered via the 8004scanner launchpad.`,
    image:
      c.image ||
      `https://api.dicebear.com/7.x/shapes/png?seed=custom-${c.agentId}`,
    services,
    tags: c.tags?.length ? c.tags : ["erc-8004", "custom-agent", "ai"],
    supportedTrust: c.supportedTrust?.length
      ? c.supportedTrust
      : ["reputation", "crypto-economic"],
    active: c.active ?? true,
    x402Support: c.x402Support ?? true,
    updatedAt: Math.floor(c.createdAt / 1000),
  };

  const agentURI =
    c.agentURI ||
    `data:application/json;base64,${encodeBase64Json({
      type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
      ...metadataPayload,
    })}`;

  return {
    agentId: c.agentId,
    chainId: c.chainId || DEFAULT_CHAIN_ID,
    chainName,
    registry,
    owner,
    agentWallet: owner,
    agentURI,
    metadata: metadataPayload,
    createdAt: Math.floor(c.createdAt / 1000),
  };
}

/** Curated demo agent for UI preview — Ethereum mainnet, rich content */
export async function getDemoAgentData(): Promise<AgentData> {
  return getMockAgentData(1, 1);
}

export async function getAgentData(
  chainIdOrId: number | string,
  agentIdParam?: number | string
): Promise<AgentData | null> {
  let chainId: number;
  let agentId: number;

  if (agentIdParam === undefined) {
    chainId = DEFAULT_CHAIN_ID;
    agentId =
      typeof chainIdOrId === "string"
        ? Number.parseInt(chainIdOrId, 10)
        : chainIdOrId;
  } else {
    chainId =
      typeof chainIdOrId === "string"
        ? Number.parseInt(chainIdOrId, 10)
        : chainIdOrId;
    agentId =
      typeof agentIdParam === "string"
        ? Number.parseInt(agentIdParam, 10)
        : agentIdParam;
  }

  if (!Number.isFinite(agentId) || agentId < 1) {
    return null;
  }

  // Lightweight demo mode: instant deterministic resolution without external RPC latency
  return getMockAgentData(chainId, agentId);
}
