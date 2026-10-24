import type { CreatedAgent } from "@/stores/created-agents-store";

export interface Agent {
    id: string;
    agentId: number;
    name: string;
    description: string;
    image: string;
    categories: string[];
    reputation: number;
    callVolume: number;
    volumeChange24h: number;
    latency: number;
    fee: number;
    successRate: number;
    totalVolume: number;
    endpoint: string;
    chains: string[];
    lastActive: number;
    createdAt: number;
    repHistory: number[];
    volumeHistory: number[];
    feeHistory: number[];
    protocol: "MCP" | "A2A" | "OASF";
    trustMethod: string;
    skills: string[];
    domains: string[];
    hasX402: boolean;
    feedbackCount: number;
    stars: string;
    owner: string;
    paymentAddress: string | null;
    isCreatedByUser?: boolean;
}

export interface ReputationEvent {
    id: string;
    agentId: number;
    type: "tag" | "fee_change" | "downtime" | "verified";
    description: string;
    score: number;
    address?: string;
    timestamp: number;
}

export interface ValidationRecord {
    id: string;
    agentId: number;
    validatorAddress: string;
    mechanism: "TEE Attestation" | "Crypto-Economic" | "Reputation Consensus";
    status: "Verified" | "Active";
    txHash: string;
    timestamp: number;
}

/** Deterministic PRNG (0..1) from an integer seed */
export function seededRandom(seed: number): number {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
}

export const AGENT_CATALOG: Array<{
    name: string;
    description: string;
    category: string;
    protocol: "MCP" | "A2A" | "OASF";
    trustMethod: string;
    skills: string[];
    domains: string[];
}> = [
    {
        name: "Gekko Scout",
        description: "24/7 multi-chain yield and TVL anomaly scanner with real-time MCP alerts across Base and Ethereum vaults.",
        category: "DeFi",
        protocol: "MCP",
        trustMethod: "On-chain",
        skills: ["Monitoring", "Analytics"],
        domains: ["DeFi", "Analytics"],
    },
    {
        name: "RiskBot v2",
        description: "Automated smart-contract risk scoring and liquidity pool rug-pull detector using TEE attestation.",
        category: "Risk",
        protocol: "MCP",
        trustMethod: "Hybrid",
        skills: ["Risk", "Analytics"],
        domains: ["Risk", "DeFi"],
    },
    {
        name: "DeFiExec",
        description: "Intent-based cross-chain execution agent for low-slippage swaps and automated portfolio rebalancing.",
        category: "Trading",
        protocol: "A2A",
        trustMethod: "On-chain",
        skills: ["Execution", "Trading"],
        domains: ["Trading", "DeFi"],
    },
    {
        name: "AlphaSignals",
        description: "On-chain whale wallet clustering and sentiment aggregation agent streaming structured OASF signals.",
        category: "Analytics",
        protocol: "OASF",
        trustMethod: "Off-chain",
        skills: ["Analytics", "Trading"],
        domains: ["Analytics", "Trading"],
    },
    {
        name: "MEVGuard",
        description: "Private mempool transaction router protecting agentic swaps against sandwich and front-running attacks.",
        category: "Infra",
        protocol: "MCP",
        trustMethod: "On-chain",
        skills: ["Execution", "Risk"],
        domains: ["Infra", "Trading"],
    },
    {
        name: "YieldOptimizer",
        description: "Autonomous lending rate arbitrageur moving stablecoin liquidity across Aave, Morpho, and Compound.",
        category: "DeFi",
        protocol: "A2A",
        trustMethod: "Hybrid",
        skills: ["Trading", "Execution"],
        domains: ["DeFi"],
    },
    {
        name: "LiquidityScanner",
        description: "Deep DEX orderbook and concentrated liquidity tick monitor for Uniswap v4 and Aerodrome.",
        category: "Analytics",
        protocol: "MCP",
        trustMethod: "On-chain",
        skills: ["Monitoring", "Analytics"],
        domains: ["Analytics", "DeFi"],
    },
    {
        name: "SmartRouter",
        description: "Multi-hop solver agent optimizing gas and bridge fees across L2 rollups with HTTP 402 micropayments.",
        category: "Infra",
        protocol: "OASF",
        trustMethod: "On-chain",
        skills: ["Execution", "Monitoring"],
        domains: ["Infra"],
    },
    {
        name: "GasOptimizer",
        description: "Predictive L1/L2 blob fee forecaster that schedules non-urgent batch transactions at lowest base fees.",
        category: "Infra",
        protocol: "MCP",
        trustMethod: "Off-chain",
        skills: ["Analytics", "Monitoring"],
        domains: ["Infra", "Analytics"],
    },
    {
        name: "PriceOracle",
        description: "Cryptographically signed low-latency price feed verifier combining Pyth, Chainlink, and DEX TWAPs.",
        category: "Infra",
        protocol: "A2A",
        trustMethod: "Hybrid",
        skills: ["Monitoring", "Risk"],
        domains: ["Infra", "DeFi"],
    },
    {
        name: "PortfolioManager",
        description: "Delta-neutral treasury management agent with automated stop-loss and yield harvesting.",
        category: "Trading",
        protocol: "MCP",
        trustMethod: "On-chain",
        skills: ["Trading", "Risk"],
        domains: ["Trading", "DeFi"],
    },
];

const REFERENCE_TIMESTAMP = 1761280000000; // Stable reference for deterministic relative times

export function getDeterministicAgentMetrics(agentId: number): Agent {
    const idx = Math.max(0, agentId - 1);
    const template = AGENT_CATALOG[idx % AGENT_CATALOG.length];
    const suffix = agentId > AGENT_CATALOG.length ? ` #${Math.floor(idx / AGENT_CATALOG.length) + 1}` : "";
    const name = `${template.name}${suffix}`;

    const r1 = seededRandom(agentId * 13 + 1);
    const r2 = seededRandom(agentId * 29 + 2);
    const r3 = seededRandom(agentId * 47 + 3);
    const r4 = seededRandom(agentId * 61 + 4);
    const r5 = seededRandom(agentId * 83 + 5);

    const reputation = Number((74 + r1 * 25.5).toFixed(1));
    const callVolume = Math.floor(450 + r2 * 8500);
    const volumeChange24h = Number((-12 + r3 * 48).toFixed(1));
    const latency = Math.floor(85 + r4 * 220);
    const fee = Number((0.0001 + r5 * 0.0008).toFixed(5));
    const successRate = Number((96.2 + r1 * 3.7).toFixed(1));
    const totalVolume = Math.floor(callVolume * fee * 1200);
    const chains = [agentId % 2 === 1 ? "Ethereum" : "Sepolia"];
    const hasX402 = r2 > 0.18;
    const feedbackCount = Math.floor(18 + r3 * 420);
    const stars = (3.9 + r1 * 1.1).toFixed(1);

    const owner = `0x${(agentId * 2654435761).toString(16).padStart(40, "a").slice(0, 40)}`;
    const paymentAddress = hasX402
        ? `x402${(agentId * 1597334677).toString(16).padStart(34, "b").slice(0, 34)}`
        : null;

    const repHistory = Array.from({ length: 7 }, (_, d) => {
        const dr = seededRandom(agentId * 100 + d * 17);
        return Number(Math.min(100, Math.max(60, reputation - 4 + dr * 8)).toFixed(1));
    });
    repHistory[6] = reputation;

    const volumeHistory = Array.from({ length: 7 }, (_, d) => {
        const dr = seededRandom(agentId * 200 + d * 23);
        return Math.floor(callVolume * (0.65 + dr * 0.6));
    });
    volumeHistory[6] = callVolume;

    const feeHistory = Array.from({ length: 7 }, (_, d) => {
        const dr = seededRandom(agentId * 300 + d * 31);
        return Number((fee * (0.9 + dr * 0.2)).toFixed(5));
    });

    const hoursAgoCreated = Math.floor(2 + seededRandom(agentId * 71) * 24 * 25);
    const minutesAgoActive = Math.floor(2 + seededRandom(agentId * 97) * 180);

    return {
        id: `agent-${agentId}`,
        agentId,
        name,
        description: template.description,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=agent-${agentId}`,
        categories: [template.category],
        reputation,
        callVolume,
        volumeChange24h,
        latency,
        fee,
        successRate,
        totalVolume,
        endpoint: `https://agent-${agentId}.8004scanner.ai/mcp`,
        chains,
        lastActive: Date.now() - minutesAgoActive * 60 * 1000,
        createdAt: Date.now() - hoursAgoCreated * 3600 * 1000,
        repHistory,
        volumeHistory,
        feeHistory,
        protocol: template.protocol,
        trustMethod: template.trustMethod,
        skills: template.skills,
        domains: template.domains,
        hasX402,
        feedbackCount,
        stars,
        owner,
        paymentAddress,
    };
}

export function generateMockAgents(count: number = 50): Agent[] {
    return Array.from({ length: count }, (_, i) => getDeterministicAgentMetrics(i + 1));
}

/** Convert a CreatedAgent from the store to the full Agent shape for display */
export function createdAgentToAgent(c: CreatedAgent): Agent {
    const primaryProtocol: "MCP" | "A2A" | "OASF" = c.services?.some(
        (s) => s.name.toUpperCase() === "A2A"
    )
        ? "A2A"
        : c.services?.some((s) => s.name.toUpperCase() === "OASF")
          ? "OASF"
          : "MCP";

    const category =
        c.domains?.[0]?.split("/").pop()?.replace(/_/g, " ") ||
        c.tags?.[0] ||
        "DeFi";

    const owner = `0x${(c.agentId * 987654321).toString(16).padStart(40, "c").slice(0, 40)}`;
    const hasX402 = c.x402Support ?? true;

    return {
        id: `created-${c.chainId}-${c.agentId}`,
        agentId: c.agentId,
        name: c.name || `Agent #${c.agentId}`,
        description:
            c.description ||
            `${c.name} is a custom ERC-8004 AI agent registered via the 8004scanner launchpad.`,
        image:
            c.image ||
            `https://api.dicebear.com/7.x/shapes/svg?seed=custom-${c.agentId}`,
        categories: [category.charAt(0).toUpperCase() + category.slice(1)],
        reputation: 94.2,
        callVolume: 1240,
        volumeChange24h: 34.8,
        latency: 95,
        fee: 0.0002,
        successRate: 99.4,
        totalVolume: 248,
        endpoint: c.endpoint || `https://agent-${c.agentId}.8004scanner.ai/mcp`,
        chains: [c.chainName || "Sepolia"],
        lastActive: c.createdAt,
        createdAt: c.createdAt,
        repHistory: [88.0, 89.2, 90.5, 91.1, 92.4, 93.6, 94.2],
        volumeHistory: [420, 580, 710, 890, 960, 1120, 1240],
        feeHistory: [0.0002, 0.0002, 0.0002, 0.0002, 0.0002, 0.0002, 0.0002],
        protocol: primaryProtocol,
        trustMethod: c.supportedTrust?.includes("tee-attestation")
            ? "Hybrid"
            : "On-chain",
        skills: c.skills?.length ? c.skills : ["Analytics", "Execution"],
        domains: c.domains?.length ? c.domains : ["DeFi", "Analytics"],
        hasX402,
        feedbackCount: 12,
        stars: "4.9",
        owner,
        paymentAddress: hasX402
            ? `x402${(c.agentId * 192837465).toString(16).padStart(34, "d").slice(0, 34)}`
            : null,
        isCreatedByUser: true,
    };
}

export function generateMockReputationEvents(
    agentId: number,
    count: number = 6
): ReputationEvent[] {
    const eventTypes: Array<ReputationEvent["type"]> = [
        "verified",
        "tag",
        "fee_change",
        "tag",
        "verified",
        "downtime",
    ];
    const tags = ["reliable", "low-latency", "accurate", "mcp-ready", "responsive"];

    return Array.from({ length: count }, (_, i) => {
        const type = eventTypes[i % eventTypes.length];
        const addr = `0x${((agentId + i + 1) * 314159265).toString(16).padStart(40, "e").slice(0, 40)}`;
        let description = "";
        let score = 0;

        switch (type) {
            case "tag": {
                const tag = tags[(agentId + i) % tags.length];
                description = `Tagged '${tag}' by validator ${addr.slice(0, 8)}...`;
                score = 3;
                break;
            }
            case "fee_change":
                description = "X402 per-call fee optimized (-15% gas overhead)";
                score = 2;
                break;
            case "downtime":
                description = "Brief RPC latency spike resolved automatically";
                score = -1;
                break;
            case "verified":
                description =
                    i === 0
                        ? "ERC-8004 Identity & EIP-712 Domain Attestation Verified"
                        : "TEE Execution Integrity Proof Confirmed";
                score = 10;
                break;
        }

        return {
            id: `event-${agentId}-${i}`,
            agentId,
            type,
            description,
            score,
            address: addr,
            timestamp: REFERENCE_TIMESTAMP - i * 14 * 3600 * 1000,
        };
    });
}

export function generateMockValidations(agentId: number): ValidationRecord[] {
    const mechanisms: ValidationRecord["mechanism"][] = [
        "TEE Attestation",
        "Crypto-Economic",
        "Reputation Consensus",
    ];

    return mechanisms.map((mechanism, i) => ({
        id: `val-${agentId}-${i}`,
        agentId,
        validatorAddress: `0x${((agentId * 17 + i * 31) * 123456789).toString(16).padStart(40, "f").slice(0, 40)}`,
        mechanism,
        status: i === 0 ? "Verified" : "Active",
        txHash: `0x${((agentId * 43 + i * 97) * 987654321).toString(16).padStart(64, "9").slice(0, 64)}`,
        timestamp: Date.now() - (i + 1) * 6 * 3600 * 1000,
    }));
}
