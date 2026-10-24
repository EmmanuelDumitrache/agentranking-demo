import { CHAINS, getChainByChainId } from "@/lib/chains";
import { SOLANA_CHAIN_ID } from "@/lib/chain-constants";
import { agentPublicPath, toAgentUrlSlug } from "@/lib/agent-public-url";
import { computeNativeAgentScore } from "@/lib/public-site/native-agent-score";
import { buildAgentInstallInfo } from "@/lib/public-site/agent-install-command";
import type { PublicAgentIndexModel } from "@/lib/public-agents-index.server";
import type { PublicRankingAgent, PublicRankingSummary, PublicRankingInput, PublicRankingPageData } from "@/lib/ranking/public-ranking.server";
import type { PublicSiteHomeData, LandingRankedAgent, SphereImageData } from "@/lib/public-site/home-types";
import type { PublicAgentPreview } from "@/lib/public-site/types";
import type { PublicStakeSummary } from "@/lib/public-stake-summary";
import type { TokenDiscoveryCardModel, LaunchIndexCardModel } from "@/lib/agent-launch/launch-index-data.server";
import type { TokenMarketSnapshot } from "@/lib/public-site/dexscreener";
import type { PublicTokenDetailData } from "@/lib/public-site/token-detail-data.server";
import type { NativeAgentDetailData } from "@/lib/public-site/native-agent-detail-data.server";
import type { VerifiedDirectoryPageData } from "@/lib/agent-directory/verified-directory";
import { getOfficialPublicToken, OFFICIAL_PUBLIC_TOKENS } from "@/lib/public-site/official-tokens";
import { resolveMarketViewModel } from "@/lib/public-site/market-view-model";

export type DemoSeedAgent = {
  id: number;
  agentId: number;
  chainId: number;
  name: string;
  description: string;
  image: string;
  category: string;
  archetype: string;
  agentMode: string;
  score: number;
  isVerified: boolean;
  isPremiumVerified: boolean;
  verificationTier: "NONE" | "INDIVIDUAL" | "BUSINESS";
  x402Support: boolean;
  mppSupport: boolean;
  mcpSupport: boolean;
  sapVerified: boolean;
  owner: string;
  agentWallet: string;
  createdAt: string;
  lastActiveAt: string;
  socials: {
    website: string | null;
    twitter: string | null;
    telegram: string | null;
    github: string | null;
  };
  capabilities: string[];
  services: Array<{ name: string; endpoint: string; version: string }>;
  token?: {
    mint: string;
    name: string;
    symbol: string;
    chain: "solana" | "robinhood";
    venue: "PumpSwap" | "Metaplex" | "Robinhood";
    priceUsd: number;
    marketCapUsd: number;
    volume24hUsd: number;
    liquidityUsd: number;
    priceChange24hPct: number;
    buys24h: number;
    sells24h: number;
  };
};

const AVATARS = [
  "/brandkit/avatars/ar-avatar-01.png",
  "/brandkit/avatars/ar-avatar-02.png",
  "/brandkit/avatars/ar-avatar-03.png",
  "/brandkit/avatars/ar-avatar-04.png",
  "/brandkit/avatars/ar-avatar-05.png",
  "/brandkit/avatars/ar-avatar-06.png",
  "/ar-mark-square.png",
  "/ar-mark.png",
];

export const DEMO_SEED_AGENTS: DemoSeedAgent[] = [
  {
    id: 101,
    agentId: 101,
    chainId: 8453,
    name: "AIXBT v2",
    description:
      "Autonomous crypto market intelligence agent indexing 400+ KOL feeds, on-chain liquidity flows, and cross-exchange perp funding in real time via ERC-8004 and MCP.",
    image: "/ar-mark-square.png",
    category: "Market Intelligence",
    archetype: "trading_analyst",
    agentMode: "autonomous",
    score: 98.4,
    isVerified: true,
    isPremiumVerified: true,
    verificationTier: "BUSINESS",
    x402Support: true,
    mppSupport: true,
    mcpSupport: true,
    sapVerified: true,
    owner: "0x71C95911E9a5D330f4D621842EC243EE1343292e",
    agentWallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    createdAt: "2026-06-12T09:30:00.000Z",
    lastActiveAt: new Date(Date.now() - 4 * 60_000).toISOString(),
    socials: {
      website: "https://aixbt.terminal.demo",
      twitter: "https://x.com/aixbt_agent",
      telegram: "https://t.me/aixbt_portal",
      github: "https://github.com/agentranking-demo/aixbt-v2",
    },
    capabilities: ["Market Alpha", "KOL Sentiment", "x402 Per-Call API", "MCP Tool Server", "Whale Flow Tracking"],
    services: [
      { name: "MCP", endpoint: "https://mcp.agentranking.io/agents/aixbt-v2/mcp", version: "2025-06-18" },
      { name: "A2A", endpoint: "https://api.agentranking.io/agents/aixbt-v2/a2a", version: "1.0.0" },
    ],
    token: {
      mint: "AIXBT7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZpump",
      name: "AIXBT Intelligence",
      symbol: "AIXBT",
      chain: "solana",
      venue: "Metaplex",
      priceUsd: 0.284,
      marketCapUsd: 28_400_000,
      volume24hUsd: 4_120_000,
      liquidityUsd: 1_850_000,
      priceChange24hPct: 18.4,
      buys24h: 1420,
      sells24h: 890,
    },
  },
  {
    id: 102,
    agentId: 102,
    chainId: 8453,
    name: "Tokyo Alpha Sentinel",
    description:
      "Bilingual EN/JP institutional DeFi execution & Nikkei/crypto correlation agent built for Tokyo Web3 desks. Supports x402 micropayments and Claude MCP.",
    image: "/ar-mark.png",
    category: "DeFi Execution",
    archetype: "defi_strategist",
    agentMode: "hybrid",
    score: 96.8,
    isVerified: true,
    isPremiumVerified: true,
    verificationTier: "BUSINESS",
    x402Support: true,
    mppSupport: true,
    mcpSupport: true,
    sapVerified: true,
    owner: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    agentWallet: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
    createdAt: "2026-07-01T04:15:00.000Z",
    lastActiveAt: new Date(Date.now() - 9 * 60_000).toISOString(),
    socials: {
      website: "https://tokyo-sentinel.demo",
      twitter: "https://x.com/tokyo_sentinel",
      telegram: "https://t.me/tokyo_sentinel",
      github: "https://github.com/EmmanuelDumitrache/agentranking-demo",
    },
    capabilities: ["Cross-Chain Arbitrage", "JPY/USDC Liquidity", "x402 Micropayments", "MCP Connector", "Risk Guardrails"],
    services: [
      { name: "MCP", endpoint: "https://mcp.agentranking.io/agents/tokyo-alpha-sentinel/mcp", version: "2025-06-18" },
      { name: "OASF", endpoint: "https://api.agentranking.io/agents/tokyo-alpha-sentinel/oasf", version: "0.8.0" },
    ],
    token: {
      mint: "TOKYO9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZpump",
      name: "Tokyo Sentinel",
      symbol: "TOKYO",
      chain: "solana",
      venue: "Metaplex",
      priceUsd: 0.0942,
      marketCapUsd: 9_420_000,
      volume24hUsd: 1_680_000,
      liquidityUsd: 740_000,
      priceChange24hPct: 24.6,
      buys24h: 980,
      sells24h: 510,
    },
  },
  {
    id: 103,
    agentId: 103,
    chainId: 1,
    name: "Aegis Prime",
    description:
      "Smart contract formal verification and pre-transaction simulation firewall protecting autonomous agent treasuries on Ethereum and Base.",
    image: "/ar-mark-3d.png",
    category: "Security & Audit",
    archetype: "security_auditor",
    agentMode: "autonomous",
    score: 95.5,
    isVerified: true,
    isPremiumVerified: true,
    verificationTier: "BUSINESS",
    x402Support: true,
    mppSupport: false,
    mcpSupport: true,
    sapVerified: false,
    owner: "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE",
    agentWallet: "4Nd1mBQtrMJVYVfKf2PJy9NZUZdTAsp7D4xWLs4gDB4T",
    createdAt: "2026-06-20T12:00:00.000Z",
    lastActiveAt: new Date(Date.now() - 14 * 60_000).toISOString(),
    socials: {
      website: "https://aegis-security.demo",
      twitter: "https://x.com/aegis_prime_ai",
      telegram: null,
      github: "https://github.com/agentranking-demo/aegis-prime",
    },
    capabilities: ["EVM Bytecode Audit", "MEV Simulation", "Slither + Symbolic Execution", "MCP Security Gate"],
    services: [
      { name: "MCP", endpoint: "https://mcp.agentranking.io/agents/aegis-prime/mcp", version: "2025-06-18" },
    ],
    token: {
      mint: "AEGIS4Nd1mBQtrMJVYVfKf2PJy9NZUZdTAsp7D4xpump",
      name: "Aegis Security Protocol",
      symbol: "AEGIS",
      chain: "solana",
      venue: "PumpSwap",
      priceUsd: 0.0615,
      marketCapUsd: 6_150_000,
      volume24hUsd: 920_000,
      liquidityUsd: 480_000,
      priceChange24hPct: 11.2,
      buys24h: 640,
      sells24h: 410,
    },
  },
  {
    id: 104,
    agentId: 104,
    chainId: SOLANA_CHAIN_ID,
    name: "Zerebro Core",
    description:
      "Hyper-autonomous Solana agent orchestrating cross-protocol yield, cultural synthesis, and Metaplex Core identity attestations via Synapse Agent Protocol (SAP).",
    image: "/ar-mark-square.png",
    category: "Autonomous Agent",
    archetype: "autonomous_creator",
    agentMode: "autonomous",
    score: 94.9,
    isVerified: true,
    isPremiumVerified: true,
    verificationTier: "INDIVIDUAL",
    x402Support: true,
    mppSupport: true,
    mcpSupport: true,
    sapVerified: true,
    owner: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    agentWallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    createdAt: "2026-06-18T16:40:00.000Z",
    lastActiveAt: new Date(Date.now() - 18 * 60_000).toISOString(),
    socials: {
      website: "https://zerebro.demo",
      twitter: "https://x.com/0xzerebro",
      telegram: "https://t.me/zerebro_core",
      github: null,
    },
    capabilities: ["SAP Attested", "Solana Jito Bundles", "Autonomous Content", "Metaplex Core Identity"],
    services: [
      { name: "MCP", endpoint: "https://mcp.agentranking.io/agents/zerebro-core/mcp", version: "2025-06-18" },
    ],
    token: {
      mint: "ZEREB8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZpump",
      name: "Zerebro",
      symbol: "ZEREBRO",
      chain: "solana",
      venue: "PumpSwap",
      priceUsd: 0.142,
      marketCapUsd: 14_200_000,
      volume24hUsd: 2_890_000,
      liquidityUsd: 1_120_000,
      priceChange24hPct: 9.7,
      buys24h: 1180,
      sells24h: 790,
    },
  },
  {
    id: 105,
    agentId: 105,
    chainId: 8453,
    name: "Luna Protocol",
    description:
      "Multi-modal autonomous ambassador and on-chain treasury manager executing verified creator bounties and automated token buybacks on Base.",
    image: "/ar-mark.png",
    category: "Creator Economy",
    archetype: "social_agent",
    agentMode: "autonomous",
    score: 93.7,
    isVerified: true,
    isPremiumVerified: false,
    verificationTier: "INDIVIDUAL",
    x402Support: true,
    mppSupport: false,
    mcpSupport: true,
    sapVerified: false,
    owner: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    agentWallet: "3yFwqXBfZY4jBVUafQ1YEXw189y2dN3V5KQq9uzBDy1E",
    createdAt: "2026-07-03T10:20:00.000Z",
    lastActiveAt: new Date(Date.now() - 25 * 60_000).toISOString(),
    socials: {
      website: "https://luna.virtuals.demo",
      twitter: "https://x.com/luna_virtuals",
      telegram: "https://t.me/luna_protocol",
      github: null,
    },
    capabilities: ["Livestream Inference", "On-Chain Bounties", "x402 Tipping", "Treasury Automation"],
    services: [
      { name: "A2A", endpoint: "https://api.agentranking.io/agents/luna-protocol/a2a", version: "1.0.0" },
    ],
    token: {
      mint: "LUNA53yFwqXBfZY4jBVUafQ1YEXw189y2dN3V5KQpump",
      name: "Luna by Virtuals",
      symbol: "LUNA",
      chain: "solana",
      venue: "PumpSwap",
      priceUsd: 0.0518,
      marketCapUsd: 5_180_000,
      volume24hUsd: 840_000,
      liquidityUsd: 410_000,
      priceChange24hPct: -3.2,
      buys24h: 520,
      sells24h: 580,
    },
  },
  {
    id: 106,
    agentId: 106,
    chainId: 42161,
    name: "Hyperliquid Perp Copilot",
    description:
      "Delta-neutral basis & funding-rate harvester executing sub-second orderbook strategies across Arbitrum and Hyperliquid L1 vaults.",
    image: "/ar-mark-3d.png",
    category: "Quant Trading",
    archetype: "quant_trader",
    agentMode: "autonomous",
    score: 92.4,
    isVerified: true,
    isPremiumVerified: true,
    verificationTier: "BUSINESS",
    x402Support: true,
    mppSupport: true,
    mcpSupport: true,
    sapVerified: false,
    owner: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
    agentWallet: "6dM8K3v9Lp2R7xW1qN5tY8uJ4hG2fD9sA3kL7mN1pQ2r",
    createdAt: "2026-07-08T08:00:00.000Z",
    lastActiveAt: new Date(Date.now() - 32 * 60_000).toISOString(),
    socials: {
      website: "https://hypercopilot.demo",
      twitter: "https://x.com/hyper_copilot",
      telegram: null,
      github: "https://github.com/agentranking-demo/hyper-copilot",
    },
    capabilities: ["Funding Rate Arb", "Delta Neutral Vaults", "x402 Signal Stream", "MCP Portfolio Tool"],
    services: [
      { name: "MCP", endpoint: "https://mcp.agentranking.io/agents/hyperliquid-perp-copilot/mcp", version: "2025-06-18" },
    ],
    token: {
      mint: "HYPE6dM8K3v9Lp2R7xW1qN5tY8uJ4hG2fD9sA3kLpump",
      name: "HyperCopilot AI",
      symbol: "HYPEAI",
      chain: "solana",
      venue: "Metaplex",
      priceUsd: 0.0389,
      marketCapUsd: 3_890_000,
      volume24hUsd: 615_000,
      liquidityUsd: 320_000,
      priceChange24hPct: 14.8,
      buys24h: 490,
      sells24h: 310,
    },
  },
  {
    id: 107,
    agentId: 107,
    chainId: 8453,
    name: "Kaito Mindshare Oracle",
    description:
      "Real-time narrative velocity and developer commit mindshare oracle serving verified trust signals to Claude, Cursor, and autonomous portfolio agents.",
    image: "/ar-mark-square.png",
    category: "Data Oracle",
    archetype: "data_oracle",
    agentMode: "service",
    score: 91.8,
    isVerified: true,
    isPremiumVerified: true,
    verificationTier: "BUSINESS",
    x402Support: true,
    mppSupport: true,
    mcpSupport: true,
    sapVerified: false,
    owner: "0xdf9Aa9818c38E209Cc5A59D90B1A1C1c0314b8e1",
    agentWallet: "8pN4M9v2Kq7L3xW5rT1yU6jH8gF4dS2aZ9kM3nB7vC5x",
    createdAt: "2026-07-11T15:10:00.000Z",
    lastActiveAt: new Date(Date.now() - 41 * 60_000).toISOString(),
    socials: {
      website: "https://mindshare.agentranking.demo",
      twitter: "https://x.com/kaito_oracle_ai",
      telegram: null,
      github: null,
    },
    capabilities: ["Mindshare Index", "Narrative Velocity", "MCP Search Server", "x402 Data Feeds"],
    services: [
      { name: "MCP", endpoint: "https://mcp.agentranking.io/agents/kaito-mindshare-oracle/mcp", version: "2025-06-18" },
    ],
    token: {
      mint: "KAIT8pN4M9v2Kq7L3xW5rT1yU6jH8gF4dS2aZ9kMpump",
      name: "Mindshare Oracle",
      symbol: "MIND",
      chain: "solana",
      venue: "PumpSwap",
      priceUsd: 0.0294,
      marketCapUsd: 2_940_000,
      volume24hUsd: 430_000,
      liquidityUsd: 260_000,
      priceChange24hPct: 6.4,
      buys24h: 380,
      sells24h: 290,
    },
  },
  {
    id: 108,
    agentId: 108,
    chainId: SOLANA_CHAIN_ID,
    name: "ElizaOS Autonomous Trader",
    description:
      "Reference ElizaOS v2 multi-agent swarm coordinator with verified Solana SPL vault custody, Jupiter routing, and FairScale reputation attestation.",
    image: "/ar-mark.png",
    category: "Swarm Coordinator",
    archetype: "swarm_coordinator",
    agentMode: "autonomous",
    score: 90.6,
    isVerified: true,
    isPremiumVerified: false,
    verificationTier: "INDIVIDUAL",
    x402Support: true,
    mppSupport: false,
    mcpSupport: true,
    sapVerified: true,
    owner: "92eXvBFGBAXwgmPf6t6CUCNJH2xChsCJuWzaGPjyPUmP",
    agentWallet: "92eXvBFGBAXwgmPf6t6CUCNJH2xChsCJuWzaGPjyPUmP",
    createdAt: "2026-07-14T11:45:00.000Z",
    lastActiveAt: new Date(Date.now() - 52 * 60_000).toISOString(),
    socials: {
      website: "https://elizaos.demo",
      twitter: "https://x.com/ai16zdao",
      telegram: "https://t.me/elizaos_agents",
      github: "https://github.com/elizaOS/eliza",
    },
    capabilities: ["ElizaOS Runtime", "Jupiter Aggregator", "SAP Verified", "Multi-Agent Swarm"],
    services: [
      { name: "MCP", endpoint: "https://mcp.agentranking.io/agents/elizaos-trader/mcp", version: "2025-06-18" },
    ],
    token: {
      mint: "ELIZ92eXvBFGBAXwgmPf6t6CUCNJH2xChsCJuWzapump",
      name: "ElizaOS Swarm",
      symbol: "ELIZA",
      chain: "solana",
      venue: "Metaplex",
      priceUsd: 0.076,
      marketCapUsd: 7_600_000,
      volume24hUsd: 1_190_000,
      liquidityUsd: 590_000,
      priceChange24hPct: 15.1,
      buys24h: 810,
      sells24h: 495,
    },
  },
  {
    id: 109,
    agentId: 109,
    chainId: SOLANA_CHAIN_ID,
    name: "Metaplex Genesis Steward",
    description:
      "Native Metaplex MPL-Core agent identity & bonding-curve launch steward automating permanent token-to-agent binding and creator fee routing.",
    image: "/ar-mark-3d.png",
    category: "Launchpad Infrastructure",
    archetype: "infrastructure_agent",
    agentMode: "service",
    score: 89.5,
    isVerified: true,
    isPremiumVerified: true,
    verificationTier: "BUSINESS",
    x402Support: false,
    mppSupport: true,
    mcpSupport: true,
    sapVerified: true,
    owner: "Dx2XPveijG6n3UpM3kEB4ZcYLZvSzrJLiCBMER36Xe6S",
    agentWallet: "Dx2XPveijG6n3UpM3kEB4ZcYLZvSzrJLiCBMER36Xe6S",
    createdAt: "2026-07-19T18:00:00.000Z",
    lastActiveAt: new Date(Date.now() - 65 * 60_000).toISOString(),
    socials: {
      website: "https://metaplex.agentranking.demo",
      twitter: "https://x.com/metaplex",
      telegram: null,
      github: null,
    },
    capabilities: ["MPL-Core Identity", "Genesis Bonding Curve", "Fee Split Automation", "MCP Inspector"],
    services: [
      { name: "MCP", endpoint: "https://mcp.agentranking.io/agents/metaplex-genesis-steward/mcp", version: "2025-06-18" },
    ],
    token: {
      mint: "GENSDx2XPveijG6n3UpM3kEB4ZcYLZvSzrJLiCBMpump",
      name: "Genesis Steward",
      symbol: "GENESIS",
      chain: "solana",
      venue: "Metaplex",
      priceUsd: 0.0215,
      marketCapUsd: 2_150_000,
      volume24hUsd: 310_000,
      liquidityUsd: 195_000,
      priceChange24hPct: 4.3,
      buys24h: 275,
      sells24h: 210,
    },
  },
  {
    id: 110,
    agentId: 110,
    chainId: 8453,
    name: "x402 Payment Gateway",
    description:
      "HTTP 402 payment-required settlement router enabling zero-signup USDC micropayments between Claude/Cursor MCP clients and on-chain AI agents.",
    image: "/ar-mark-square.png",
    category: "Payments & x402",
    archetype: "payment_router",
    agentMode: "service",
    score: 88.9,
    isVerified: true,
    isPremiumVerified: true,
    verificationTier: "BUSINESS",
    x402Support: true,
    mppSupport: true,
    mcpSupport: true,
    sapVerified: false,
    owner: "0x1111111254fb6c44bAC0beD2854e76F90643097d",
    agentWallet: "5dNpPLZdmpGT1htDm3x45bAeTWpqyuZE7zLcM6piSKPC",
    createdAt: "2026-07-22T09:00:00.000Z",
    lastActiveAt: new Date(Date.now() - 78 * 60_000).toISOString(),
    socials: {
      website: "https://x402.agentranking.demo",
      twitter: "https://x.com/agentranking",
      telegram: null,
      github: "https://github.com/agentranking-demo/x402-gateway",
    },
    capabilities: ["HTTP 402 Settlement", "Base USDC Instant Pay", "MCP Billing Metering", "MPP Compatible"],
    services: [
      { name: "MCP", endpoint: "https://mcp.agentranking.io/agents/x402-gateway/mcp", version: "2025-06-18" },
    ],
  },
  {
    id: 111,
    agentId: 111,
    chainId: 4663,
    name: "Robinhood Quiver Scout",
    description:
      "Robinhood Chain (4663) tokenized equity & DeFi momentum scout launched via Quiver with verified ERC-8004 identity and automated fee sharing.",
    image: "/ar-mark.png",
    category: "Robinhood Chain",
    archetype: "market_scout",
    agentMode: "autonomous",
    score: 87.6,
    isVerified: true,
    isPremiumVerified: false,
    verificationTier: "INDIVIDUAL",
    x402Support: true,
    mppSupport: false,
    mcpSupport: true,
    sapVerified: false,
    owner: "0x9876543210fedcba9876543210fedcba98765432",
    agentWallet: "EbGkrgtrcPTcXe3ATgrZUm9yEG8XHRPzyqFFyEsvYdVh",
    createdAt: "2026-07-25T14:20:00.000Z",
    lastActiveAt: new Date(Date.now() - 95 * 60_000).toISOString(),
    socials: {
      website: "https://quiver.agentranking.demo",
      twitter: "https://x.com/quiver_scout",
      telegram: null,
      github: null,
    },
    capabilities: ["Robinhood Chain 4663", "Quiver Launchpad", "ERC-8004 Identity", "Momentum Signals"],
    services: [
      { name: "A2A", endpoint: "https://api.agentranking.io/agents/quiver-scout/a2a", version: "1.0.0" },
    ],
    token: {
      mint: "0x4663aBcDeF1234567890aBcDeF12345678904663",
      name: "Quiver Scout",
      symbol: "QUIVER",
      chain: "robinhood",
      venue: "Robinhood",
      priceUsd: 0.0184,
      marketCapUsd: 1_840_000,
      volume24hUsd: 295_000,
      liquidityUsd: 165_000,
      priceChange24hPct: 21.3,
      buys24h: 340,
      sells24h: 190,
    },
  },
  {
    id: 112,
    agentId: 112,
    chainId: 56,
    name: "BNB Yield Architect",
    description:
      "AutomatedVenus + PancakeSwap v4 concentrated liquidity rebalancer registered on BNB Smart Chain ERC-8004 identity registry.",
    image: "/ar-mark-3d.png",
    category: "Yield Optimizer",
    archetype: "yield_optimizer",
    agentMode: "autonomous",
    score: 86.2,
    isVerified: true,
    isPremiumVerified: false,
    verificationTier: "INDIVIDUAL",
    x402Support: true,
    mppSupport: false,
    mcpSupport: false,
    sapVerified: false,
    owner: "0x2222222222222222222222222222222222222222",
    agentWallet: "HHLhtB4EpqebCbpw1X3DZjfQMK4Erdj5VKXeWfNzUSR9",
    createdAt: "2026-07-28T07:30:00.000Z",
    lastActiveAt: new Date(Date.now() - 120 * 60_000).toISOString(),
    socials: {
      website: "https://bnbyield.demo",
      twitter: "https://x.com/bnb_yield_ai",
      telegram: null,
      github: null,
    },
    capabilities: ["BNB Chain LP", "PancakeSwap v4 Hooks", "x402 Rebalance API"],
    services: [
      { name: "A2A", endpoint: "https://api.agentranking.io/agents/bnb-yield/a2a", version: "1.0.0" },
    ],
  },
];

const CUSTOM_AGENTS_STORAGE_KEY = "agentranking_demo_custom_agents_v1";

export function readCustomDemoAgentsFromStorage(): DemoSeedAgent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_AGENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DemoSeedAgent[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomDemoAgentToStorage(agent: DemoSeedAgent): void {
  if (typeof window === "undefined") return;
  try {
    const existing = readCustomDemoAgentsFromStorage().filter(
      (item) => !(item.chainId === agent.chainId && item.agentId === agent.agentId),
    );
    const updated = [agent, ...existing];
    window.localStorage.setItem(CUSTOM_AGENTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("agentranking:demo-updated"));
  } catch {
    // Ignore storage quota errors
  }
}

export function getAllDemoAgents(): DemoSeedAgent[] {
  const custom = readCustomDemoAgentsFromStorage();
  const seen = new Set<string>();
  const combined: DemoSeedAgent[] = [];
  for (const agent of [...custom, ...DEMO_SEED_AGENTS]) {
    const key = `${agent.chainId}:${agent.agentId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    combined.push(agent);
  }
  return combined;
}

export function toPublicAgentIndexModel(seed: DemoSeedAgent): PublicAgentIndexModel {
  const profileHref = agentPublicPath({
    chainId: seed.chainId,
    agentId: seed.agentId,
    name: seed.name,
  });
  const tok = seed.token;
  const market: TokenMarketSnapshot | null = tok
    ? {
        source: "dexscreener",
        chainId: tok.chain,
        pairAddress: tok.mint,
        pairUrl: `https://dexscreener.com/${tok.chain}/${tok.mint}`,
        dexId: tok.venue.toLowerCase(),
        priceUsd: tok.priceUsd,
        marketCapUsd: tok.marketCapUsd,
        fdvUsd: tok.marketCapUsd,
        volume24hUsd: tok.volume24hUsd,
        liquidityUsd: tok.liquidityUsd,
        priceChange24hPct: tok.priceChange24hPct,
        txns24hBuys: tok.buys24h,
        txns24hSells: tok.sells24h,
        baseSymbol: tok.symbol,
        quoteSymbol: "SOL",
        pairCreatedAt: seed.createdAt,
        athMarketCapUsd: tok.marketCapUsd * 1.35,
        rawUpdatedAt: new Date().toISOString(),
      }
    : null;

  return {
    id: seed.id,
    agentId: seed.agentId,
    chainId: seed.chainId,
    name: seed.name,
    image: seed.image,
    description: seed.description,
    isVerified: seed.isVerified,
    isPremiumVerified: seed.isPremiumVerified,
    publicVerificationStatus: seed.isVerified ? "verified" : "unverified",
    arVerificationStatus: seed.isVerified ? "verified" : null,
    ownerAccountVerified: seed.verificationTier !== "NONE",
    credential: {
      present: seed.verificationTier !== "NONE",
      publicId: `AR-CRED-${seed.agentId}`,
      level: seed.verificationTier,
      status: seed.verificationTier !== "NONE" ? "VERIFIED" : "UNVERIFIED",
      verifiedAt: seed.createdAt,
      expiresAt: "2027-12-31T23:59:59.000Z",
      proofPath: "/verified",
    },
    isSolanaDirectoryListed: seed.chainId === SOLANA_CHAIN_ID || seed.sapVerified,
    agentRankScore: seed.score,
    listedAt: seed.createdAt,
    lastActiveAt: seed.lastActiveAt,
    profileHref,
    linkedToken: tok
      ? {
          launchId: `launch-${seed.id}`,
          mint: tok.mint,
          tokenName: tok.name,
          tokenSymbol: tok.symbol,
          launchHref: `/tokens/${tok.mint}`,
        }
      : null,
    linkedTokenChain: tok ? tok.chain : null,
    linkedTokenVenue: tok ? tok.venue : null,
    market,
    launchCreatedAt: seed.createdAt,
    totalFeesDistributedLamports: "1840000000",
    buyCount: tok?.buys24h ?? 0,
    sellCount: tok?.sells24h ?? 0,
  };
}

export function toPublicRankingAgent(seed: DemoSeedAgent, rank: number): PublicRankingAgent {
  const chainConfig = getChainByChainId(seed.chainId);
  const card = toPublicAgentIndexModel(seed);
  return {
    id: seed.id,
    rank,
    agentId: seed.agentId,
    name: seed.name,
    image: seed.image,
    description: seed.description,
    lastActiveAt: seed.lastActiveAt,
    profilePath: card.profileHref,
    arScore: seed.score,
    trustLabel: seed.isVerified ? "Verified" : "High",
    totalFeedback: 48 + (seed.id % 37),
    x402Support: seed.x402Support,
    verified: seed.isVerified,
    protocol: seed.mcpSupport ? "MCP · ERC-8004" : "ERC-8004",
    chain: {
      name: chainConfig?.name ?? (seed.chainId === SOLANA_CHAIN_ID ? "Solana" : `Chain ${seed.chainId}`),
      shortName: chainConfig?.shortName ?? (seed.chainId === SOLANA_CHAIN_ID ? "SOL" : "EVM"),
    },
    card,
  };
}

export function buildDemoRankingSummary(): PublicRankingSummary {
  const chainCatalog = [
    { chainId: 8453, count: 12_640 },
    { chainId: 1, count: 9_850 },
    { chainId: SOLANA_CHAIN_ID, count: 4_980 },
    { chainId: 56, count: 38_920 },
    { chainId: 42161, count: 1_240 },
    { chainId: 4663, count: 842 },
    { chainId: 5042002, count: 42_180 },
  ];
  const chains = chainCatalog.map((row) => {
    const cfg = getChainByChainId(row.chainId);
    return {
      chainId: row.chainId,
      name: cfg?.name ?? (row.chainId === SOLANA_CHAIN_ID ? "Solana" : `Chain ${row.chainId}`),
      shortName: cfg?.shortName ?? (row.chainId === SOLANA_CHAIN_ID ? "SOL" : String(row.chainId)),
      agentCount: row.count,
    };
  });
  return {
    totalAgents: 68_450,
    verifiedAgents: 1_842,
    totalChains: 20,
    x402Agents: 2_410,
    mppAgents: 980,
    indexedAgents: 119_420,
    rankedVerifiedAgents: 1_842,
    activeUnrankedAgents: 18_640,
    deadOrSpamAgents: 32_330,
    chains,
  };
}

export function filterDemoRankingPage(input: PublicRankingInput): PublicRankingPageData {
  const all = getAllDemoAgents();
  const q = input.query.trim().toLowerCase();
  const filtered = all.filter((agent) => {
    if (input.chainId != null && input.chainId > 0 && agent.chainId !== input.chainId) return false;
    if (input.verifiedOnly && !agent.isVerified) return false;
    if (input.x402Only && !agent.x402Support) return false;
    if (input.mppOnly && !agent.mppSupport) return false;
    if (q) {
      const hay = `${agent.name} ${agent.description} ${agent.category} ${agent.token?.symbol ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => b.score - a.score);
  return {
    agents: sorted.map((agent, idx) => toPublicRankingAgent(agent, idx + 1)),
    hasPrevious: false,
    hasNext: false,
    previousCursor: null,
    nextCursor: null,
    generatedAt: new Date().toISOString(),
  };
}

export function buildDemoTokenDiscoveryCards(): TokenDiscoveryCardModel[] {
  const agents = getAllDemoAgents().filter((a) => Boolean(a.token));
  return agents.map((seed) => {
    const tok = seed.token!;
    const profileHref = agentPublicPath({
      chainId: seed.chainId,
      agentId: seed.agentId,
      name: seed.name,
    });
    const market: TokenMarketSnapshot = {
      source: "dexscreener",
      chainId: tok.chain,
      pairAddress: tok.mint,
      pairUrl: `https://dexscreener.com/${tok.chain}/${tok.mint}`,
      dexId: tok.venue.toLowerCase(),
      priceUsd: tok.priceUsd,
      marketCapUsd: tok.marketCapUsd,
      fdvUsd: tok.marketCapUsd,
      volume24hUsd: tok.volume24hUsd,
      liquidityUsd: tok.liquidityUsd,
      priceChange24hPct: tok.priceChange24hPct,
      txns24hBuys: tok.buys24h,
      txns24hSells: tok.sells24h,
      baseSymbol: tok.symbol,
      quoteSymbol: tok.chain === "robinhood" ? "ETH" : "SOL",
      pairCreatedAt: seed.createdAt,
      athMarketCapUsd: tok.marketCapUsd * 1.4,
      rawUpdatedAt: new Date().toISOString(),
    };
    const linkedAgent = {
      id: seed.id,
      agentId: seed.agentId,
      chainId: seed.chainId,
      name: seed.name,
      image: seed.image,
      description: seed.description,
      isVerified: seed.isVerified,
      isPremiumVerified: seed.isPremiumVerified,
      publicVerificationStatus: "verified",
      arVerificationStatus: "verified",
      ownerAccountVerified: true,
      credential: {
        present: true,
        publicId: `AR-CRED-${seed.agentId}`,
        level: seed.verificationTier,
        status: "VERIFIED" as const,
        verifiedAt: seed.createdAt,
        expiresAt: "2027-12-31T23:59:59.000Z",
        proofPath: "/verified",
      },
      isSolanaDirectoryListed: seed.chainId === SOLANA_CHAIN_ID || seed.sapVerified,
      profileHref,
      publicHref: profileHref,
      chainName: getChainByChainId(seed.chainId)?.name ?? "Base",
      chainShortName: getChainByChainId(seed.chainId)?.shortName ?? "BASE",
    };

    const launchModel: LaunchIndexCardModel = {
      launch: {
        id: `launch-${seed.id}`,
        agentId: String(seed.agentId),
        agentDbId: seed.id,
        creatorWallet: seed.agentWallet,
        arTreasuryWallet: "92eXvBFGBAXwgmPf6t6CUCNJH2xChsCJuWzaGPjyPUmP",
        agentWalletPublic: seed.agentWallet,
        mint: tok.mint,
        tokenName: tok.name,
        tokenSymbol: tok.symbol,
        tokenDescription: seed.description,
        tokenImageUrl: seed.image,
        metadataUri: `https://ipfs.io/ipfs/bafkreidemo${seed.id}`,
        metadataJson: null,
        passportJson: null,
        profileDisplayName: tok.name,
        profileShortDescription: seed.description,
        profileLongDescription: seed.description,
        profileAvatarUrl: seed.image,
        profileBannerUrl: null,
        profileWebsite: seed.socials.website,
        profileTwitter: seed.socials.twitter,
        profileTelegram: seed.socials.telegram,
        profileGithub: seed.socials.github,
        profileTags: seed.capabilities.slice(0, 4),
        archetype: seed.archetype,
        network: "mainnet-beta",
        launchStatus: "indexed",
        launchLifecycleStatus: "indexed",
        launchKind: tok.venue === "Metaplex" ? "metaplex" : "pumpfun",
        feeSharingStatus: "active",
        sharingConfigAddress: null,
        creatorShareBps: 9000,
        arShareBps: 1000,
        creationSignature: `5DemoSig${seed.id}`,
        feeShareSignature: `5DemoFee${seed.id}`,
        totalFeesDistributedLamports: "2450000000",
        totalCreatorFeesLamports: "2205000000",
        totalArFeesLamports: "245000000",
        lastDistributionAt: seed.lastActiveAt,
        arTokenVerificationStatus: "verified",
        errorMessage: null,
        createdAt: seed.createdAt,
        updatedAt: seed.lastActiveAt,
      } as unknown as LaunchIndexCardModel["launch"],
      profile: {
        displayName: tok.name,
        shortDescription: seed.description,
        longDescription: seed.description,
        avatarUrl: seed.image,
        bannerUrl: null,
        website: seed.socials.website,
        twitter: seed.socials.twitter,
        telegram: seed.socials.telegram,
        github: seed.socials.github,
        tags: seed.capabilities.slice(0, 4),
      },
      tokenImageUrl: seed.image,
      passport: null,
      linkedAgent: linkedAgent as unknown as LaunchIndexCardModel["linkedAgent"],
      capabilityBadges: seed.capabilities.slice(0, 3),
      lifecycleLabel: "Live",
      buyCount: tok.buys24h,
      sellCount: tok.sells24h,
      totalDistributedLabel: "2.45 SOL",
      creatorShareLabel: "90%",
      arShareLabel: "10%",
      market,
      socials: {
        website: seed.socials.website,
        twitter: seed.socials.twitter,
        telegram: seed.socials.telegram,
        github: seed.socials.github,
      },
      graduation: {
        progressPct: 100,
        graduated: true,
        statusLabel: tok.venue === "Metaplex" ? "Genesis" : "Graduated",
        detailLabel: tok.venue === "Metaplex" ? "Metaplex Genesis launch" : "Trading on DEX",
        showBar: tok.venue !== "Metaplex",
      },
    };

    return {
      chain: tok.chain,
      id: `token-${seed.id}`,
      tokenSymbol: tok.symbol,
      tokenName: tok.name,
      tokenImageUrl: seed.image,
      detailHref: `/tokens/${tok.mint}`,
      createdAt: seed.createdAt,
      linkedAgent: linkedAgent as unknown as TokenDiscoveryCardModel["linkedAgent"],
      market,
      socials: {
        website: seed.socials.website,
        twitter: seed.socials.twitter,
        telegram: seed.socials.telegram,
        github: seed.socials.github,
      },
      launch: launchModel,
      sourceVerified: true,
      sourceLabel: tok.venue,
      graduation: launchModel.graduation,
    };
  });
}

export function buildDemoHomeData(): PublicSiteHomeData {
  const all = getAllDemoAgents();
  const tokens = buildDemoTokenDiscoveryCards();
  const agents: PublicAgentPreview[] = all.map((seed) => ({
    id: seed.id,
    name: seed.name,
    image: seed.image,
    description: seed.description,
    publicVerificationStatus: seed.isVerified ? "verified" : "unverified",
    arVerificationStatus: seed.isVerified ? "verified" : null,
    ownerAccountVerified: seed.verificationTier !== "NONE",
    credential: {
      present: seed.verificationTier !== "NONE",
      publicId: `AR-CRED-${seed.agentId}`,
      level: seed.verificationTier,
      status: seed.verificationTier !== "NONE" ? "VERIFIED" : "UNVERIFIED",
      verifiedAt: seed.createdAt,
      expiresAt: "2027-12-31T23:59:59.000Z",
      proofPath: "/verified",
    },
    isVerified: seed.isVerified,
    tokenized: Boolean(seed.token),
    profileHref: agentPublicPath({
      chainId: seed.chainId,
      agentId: seed.agentId,
      name: seed.name,
    }),
    linkedTokenLabel: seed.token ? `$${seed.token.symbol}` : null,
    linkedTokenHref: seed.token ? `/tokens/${seed.token.mint}` : null,
    linkedTokenVenue: seed.token ? seed.token.venue : null,
    agentRankScore: seed.score,
    lastActiveAt: seed.lastActiveAt,
    listedAt: seed.createdAt,
    socials: {
      twitter: seed.socials.twitter,
      telegram: seed.socials.telegram,
      website: seed.socials.website,
    },
  }));

  const rankedAgents: LandingRankedAgent[] = all.slice(0, 10).map((seed, idx) => {
    const chainCfg = getChainByChainId(seed.chainId);
    const words = seed.name.split(/\s+/);
    const initials = words.length >= 2
      ? `${words[0]![0] ?? ""}${words[1]![0] ?? ""}`.toUpperCase()
      : seed.name.slice(0, 2).toUpperCase();
    return {
      rank: String(idx + 1).padStart(2, "0"),
      href: agentPublicPath({
        chainId: seed.chainId,
        agentId: seed.agentId,
        name: seed.name,
      }),
      initials,
      name: seed.name,
      verified: seed.isVerified,
      chains: chainCfg?.shortName ?? (seed.chainId === SOLANA_CHAIN_ID ? "SOL" : "BASE"),
      category: seed.category,
      score: seed.score.toFixed(1),
      imageUrl: seed.image,
    };
  });

  const sphereAgents: SphereImageData[] = all.map((seed, idx) => ({
    id: `sphere-${seed.id}`,
    src: seed.image || AVATARS[idx % AVATARS.length]!,
    alt: seed.name,
  }));

  return {
    stats: {
      totalAgents: 119_420,
      totalChains: 20,
      verifiedAgents: 1_842,
      sapVerifiedAgents: 640,
      mcpAgents: 4_860,
      generatedAt: new Date().toISOString(),
      isLive: true,
    },
    tokenLaunchCount: 842,
    nativeAgentCount: 1_842,
    tokens,
    agents,
    rankedAgents,
    sphereAgents,
  };
}

export function buildDemoStakeSummary(): PublicStakeSummary {
  return {
    generatedAt: new Date().toISOString(),
    stakingSource: "onchain",
    stakingEnabled: true,
    poolConfigured: true,
    clusterLabel: "Mainnet",
    totalStakedAr: 142_850_000,
    activeStakers: 1_428,
    stakingRewardsAr: 18_500_000,
    bonusRewardsVaultAr: 25_000_000,
    buybacksUsd: 482_900,
    buybacksAr: 19_400_000,
    buybacksSol: 2_680,
    feesToFlywheelUsd: 614_200,
    priceUsd: 0.0248,
    marketCapUsd: 24_800_000,
  };
}

export function resolveOrSynthesizeDemoAgent(
  chainId: number,
  agentId: number,
  requestedSlug?: string,
): DemoSeedAgent {
  const all = getAllDemoAgents();
  const exact = all.find((a) => a.chainId === chainId && a.agentId === agentId);
  if (exact) return exact;
  const byAgentId = all.find((a) => a.agentId === agentId);
  if (byAgentId) return { ...byAgentId, chainId };

  const readableName = requestedSlug
    ? requestedSlug
        .split("-")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : `Agent #${agentId}`;

  return {
    id: agentId,
    agentId,
    chainId,
    name: readableName || `Agent #${agentId}`,
    description:
      "Autonomous on-chain AI agent indexed by AgentRanking across ERC-8004 and Solana registries with verified endpoint telemetry and MCP tool discovery.",
    image: "/ar-mark-square.png",
    category: "Autonomous Agent",
    archetype: "autonomous_agent",
    agentMode: "autonomous",
    score: 88.4,
    isVerified: true,
    isPremiumVerified: false,
    verificationTier: "INDIVIDUAL",
    x402Support: true,
    mppSupport: false,
    mcpSupport: true,
    sapVerified: chainId === SOLANA_CHAIN_ID,
    owner: "0x71C95911E9a5D330f4D621842EC243EE1343292e",
    agentWallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    createdAt: "2026-07-15T12:00:00.000Z",
    lastActiveAt: new Date(Date.now() - 15 * 60_000).toISOString(),
    socials: {
      website: "https://agentranking.io",
      twitter: "https://x.com/agentranking",
      telegram: null,
      github: "https://github.com/EmmanuelDumitrache/agentranking-demo",
    },
    capabilities: ["ERC-8004 Identity", "MCP Tool Server", "x402 Micropayments", "Autonomous Execution"],
    services: [
      {
        name: "MCP",
        endpoint: `https://mcp.agentranking.io/agents/${toAgentUrlSlug(readableName)}/mcp`,
        version: "2025-06-18",
      },
    ],
  };
}

export function buildDemoNativeAgentDetailData(
  chainId: number,
  agentId: number,
  requestedSlug?: string,
): NativeAgentDetailData {
  const seed = resolveOrSynthesizeDemoAgent(chainId, agentId, requestedSlug);
  const chainCfg = getChainByChainId(seed.chainId);
  const chainName =
    chainCfg?.name ?? (seed.chainId === SOLANA_CHAIN_ID ? "Solana" : `Chain ${seed.chainId}`);
  const chainShortName =
    chainCfg?.shortName ?? (seed.chainId === SOLANA_CHAIN_ID ? "SOL" : "BASE");
  const profilePath = agentPublicPath({
    chainId: seed.chainId,
    agentId: seed.agentId,
    name: seed.name,
  });

  const nativeScore = computeNativeAgentScore({
    name: seed.name,
    description: seed.description,
    image: seed.image,
    hasWebsite: Boolean(seed.socials.website),
    hasTwitter: Boolean(seed.socials.twitter),
    hasTelegram: Boolean(seed.socials.telegram),
    hasGithub: Boolean(seed.socials.github),
    agentMode: seed.agentMode,
    archetype: seed.archetype,
    publicVerificationStatus: seed.isVerified ? "verified" : "unverified",
    isVerified: seed.isVerified,
    arVerificationStatus: seed.isVerified ? "verified" : "unverified",
    hasAgentWallet: true,
    agentWalletPublicKey: seed.agentWallet,
    hasTokenLaunched: Boolean(seed.token),
    tokenMint: seed.token?.mint ?? null,
    tokenName: seed.token?.name ?? null,
    tokenSymbol: seed.token?.symbol ?? null,
    tokenImageUrl: seed.image,
    tokenHasMetadata: Boolean(seed.token),
    tokenHasMarketLinks: Boolean(seed.token),
    capabilitiesCount: seed.capabilities.length,
    mcpOffersCount: seed.mcpSupport ? 2 : 0,
    x402Support: seed.x402Support,
    sapCapabilitiesCount: seed.sapVerified ? 3 : 0,
    hasRecentActivity: true,
    hasRecentLaunch: Boolean(seed.token),
    hasGithubConnection: Boolean(seed.socials.github),
  });

  const socials: NativeAgentDetailData["socials"] = [];
  if (seed.socials.website) socials.push({ kind: "website", url: seed.socials.website });
  if (seed.socials.twitter) socials.push({ kind: "twitter", url: seed.socials.twitter });
  if (seed.socials.telegram) socials.push({ kind: "telegram", url: seed.socials.telegram });
  if (seed.socials.github) socials.push({ kind: "github", url: seed.socials.github });

  const tok = seed.token;
  const marketSnapshot: TokenMarketSnapshot | null = tok
    ? {
        source: "dexscreener",
        chainId: tok.chain,
        pairAddress: tok.mint,
        pairUrl: `https://dexscreener.com/${tok.chain}/${tok.mint}`,
        dexId: tok.venue.toLowerCase(),
        priceUsd: tok.priceUsd,
        marketCapUsd: tok.marketCapUsd,
        fdvUsd: tok.marketCapUsd,
        volume24hUsd: tok.volume24hUsd,
        liquidityUsd: tok.liquidityUsd,
        priceChange24hPct: tok.priceChange24hPct,
        txns24hBuys: tok.buys24h,
        txns24hSells: tok.sells24h,
        baseSymbol: tok.symbol,
        quoteSymbol: "SOL",
        pairCreatedAt: seed.createdAt,
        athMarketCapUsd: tok.marketCapUsd * 1.35,
        rawUpdatedAt: new Date().toISOString(),
      }
    : null;

  const install = buildAgentInstallInfo(chainShortName, seed.agentId, {
    name: seed.name,
    description: seed.description,
    agentURI: `ipfs://bafkreidemo${seed.agentId}`,
    services: seed.services.map((s, idx) => ({
      id: idx + 1,
      name: s.name,
      endpoint: s.endpoint,
      version: s.version,
      sourceName: s.name,
      normalizedType: s.name.toLowerCase(),
      sourceEndpoint: s.endpoint,
      endpointKind: "https",
      endpointValid: true,
      sourceVersion: s.version,
      sourceDigest: null,
      sourceKind: "erc8004",
      skills: seed.capabilities,
      domains: [seed.category],
      capabilities: seed.capabilities,
      extensions: null,
    })),
    metadata: [],
    mcpOffers: [
      {
        id: 1,
        title: `${seed.name} MCP Server`,
        summary: seed.description,
        ctaUrl: seed.services[0]?.endpoint ?? "https://mcp.agentranking.io/mcp",
        isPublished: true,
        linkedService: {
          name: "MCP",
          endpoint: seed.services[0]?.endpoint ?? "https://mcp.agentranking.io/mcp",
        },
      },
    ],
    officialLinks: [],
    paidServices: [],
    verificationSignals: [],
    sapProtocols: ["MCP", "ERC-8004"],
  });

  return {
    id: seed.id,
    agentId: seed.agentId,
    chainId: seed.chainId,
    name: seed.name,
    profilePath,
    description: seed.description,
    image: seed.image,
    owner: seed.owner,
    isActive: true,
    isVerified: seed.isVerified,
    isSolanaDirectoryListed: seed.chainId === SOLANA_CHAIN_ID || seed.sapVerified,
    credential: {
      present: seed.verificationTier !== "NONE",
      publicId: `AR-CRED-${seed.agentId}`,
      level: seed.verificationTier,
      status: seed.verificationTier !== "NONE" ? "VERIFIED" : "UNVERIFIED",
      verifiedAt: seed.createdAt,
      expiresAt: "2027-12-31T23:59:59.000Z",
      proofPath: "/verified",
    },
    verifiedAt: seed.createdAt,
    solanaRegisteredAt: seed.createdAt,
    publicVerificationStatus: seed.isVerified ? "verified" : "unverified",
    arVerificationStatus: seed.isVerified ? "verified" : "unverified",
    chain: {
      chainId: seed.chainId,
      name: chainName,
      shortName: chainShortName,
    },
    listingRegistrySource: seed.chainId === SOLANA_CHAIN_ID ? "sap" : "erc8004",
    nativeScore,
    agentWalletPublicKey: seed.agentWallet,
    socials,
    linkedTokens: tok
      ? [
          {
            launchId: `launch-${seed.id}`,
            mint: tok.mint,
            symbol: tok.symbol,
            name: tok.name,
            imageUrl: seed.image,
            network: "mainnet-beta",
            source: tok.venue === "Metaplex" ? "metaplex" : "pumpfun",
            marketView: resolveMarketViewModel({
              isMainnet: true,
              mint: tok.mint,
              market: marketSnapshot,
              pumpFun: null,
            }),
          },
        ]
      : [],
    capabilities: seed.capabilities.map((label) => ({
      label,
      kind: label.toLowerCase().includes("x402")
        ? "x402"
        : label.toLowerCase().includes("mcp")
          ? "mcp"
          : "service",
    })),
    events: [
      {
        label: "Verification complete",
        description: `Operator credential AR-CRED-${seed.agentId}`,
        date: seed.createdAt.slice(0, 10),
        kind: "verification",
      },
      ...(tok
        ? [
            {
              label: `$${tok.symbol} launched`,
              description: `Mint: ${tok.mint.slice(0, 6)}...${tok.mint.slice(-4)}`,
              date: seed.createdAt.slice(0, 10),
              kind: "token" as const,
            },
          ]
        : []),
      {
        label: "Agent wallet generated",
        description: `Wallet ${seed.agentWallet.slice(0, 6)}...${seed.agentWallet.slice(-4)}`,
        date: seed.createdAt.slice(0, 10),
        kind: "wallet",
      },
      {
        label: "Agent created",
        description: `${seed.name} registered on AgentRanking`,
        date: seed.createdAt.slice(0, 10),
        kind: "created",
      },
    ],
    onchain: {
      evidence: {
        hasChainEvidence: true,
        hasVerifiedChainEvidence: seed.isVerified,
        chainAnchoredServiceCount: seed.services.length,
      },
      evidenceLevel: seed.isVerified ? "chain-verified" : "chain-observed",
      protocol: seed.chainId === SOLANA_CHAIN_ID ? "SAP" : "ERC-8004",
      protocols: ["ERC-8004", "MCP", ...(seed.x402Support ? ["x402"] : [])],
      identity: {
        protocolAgentId: String(seed.agentId),
        currentOwner: seed.owner,
        agentWallet: seed.agentWallet,
        agentUri: `ipfs://bafkreidemo${seed.agentId}`,
      },
      registration: {
        parsedCore: {
          type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
          supportedTrust: ["reputation", "crypto-economic", "tee-attestation"],
          registrations: [
            {
              agentRegistry: `eip155:${seed.chainId}:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`,
              agentId: String(seed.agentId),
            },
          ],
        },
      },
      metadata: [
        { key: "category", value: seed.category },
        { key: "archetype", value: seed.archetype },
        { key: "x402Support", value: String(seed.x402Support) },
      ],
      services: seed.services.map((s) => ({
        name: s.name,
        sourceName: s.name,
        endpoint: s.endpoint,
        normalizedEndpoint: s.endpoint,
        normalizedType: s.name,
        endpointKind: "https",
        endpointValid: true,
        chainAnchored: true,
        skills: seed.capabilities,
        capabilities: seed.capabilities,
      })),
      reputation: {
        totalFeedbackCount: 42,
        decodedDocumentCount: 42,
        hashVerifiedDocumentCount: 40,
        recentUniqueClientCount: 29,
        recent: [],
      },
      validation: {
        responseCount: 18,
        successfulResponseCount: 18,
        hashVerifiedDocumentCount: 18,
        uniqueValidatorCount: 5,
        recent: [],
      },
      history: {
        identity: [],
        metadata: [],
        solana: [],
      },
      sap: null,
      metaplex: null,
      solana: null,
    } as unknown as NativeAgentDetailData["onchain"],
    feeTotals: tok
      ? {
          totalFeesDistributedLamports: "2450000000",
          totalCreatorFeesLamports: "2205000000",
          totalArFeesLamports: "245000000",
          lastDistributionAt: seed.lastActiveAt,
        }
      : null,
    createdAt: seed.createdAt,
    lastActiveAt: seed.lastActiveAt,
    fairscaleAssessment: null,
    talk: {
      status: "live",
      endpointUrl: seed.services[0]?.endpoint ?? "https://mcp.agentranking.io/mcp",
      serviceName: seed.services[0]?.name ?? "MCP",
    } as unknown as NativeAgentDetailData["talk"],
    install,
  };
}

export function buildDemoTokenDetailData(mint: string): PublicTokenDetailData {
  const official = getOfficialPublicToken(mint);
  const cards = buildDemoTokenDiscoveryCards();
  const matchedCard = cards.find(
    (c) => c.launch?.launch.mint?.toLowerCase() === mint.toLowerCase(),
  );

  if (official || !matchedCard) {
    const tok = official ?? OFFICIAL_PUBLIC_TOKENS[0]!;
    const market: TokenMarketSnapshot = {
      source: "dexscreener",
      chainId: "solana",
      pairAddress: tok.mint,
      pairUrl: `https://dexscreener.com/solana/${tok.mint}`,
      dexId: "raydium",
      priceUsd: 0.0248,
      marketCapUsd: 24_800_000,
      fdvUsd: 24_800_000,
      volume24hUsd: 3_420_000,
      liquidityUsd: 1_950_000,
      priceChange24hPct: 16.2,
      txns24hBuys: 1840,
      txns24hSells: 920,
      baseSymbol: tok.symbol,
      quoteSymbol: "SOL",
      pairCreatedAt: "2026-06-01T00:00:00.000Z",
      athMarketCapUsd: 38_000_000,
      rawUpdatedAt: new Date().toISOString(),
    };
    const now = new Date().toISOString();
    return {
      kind: "official",
      launch: {
        id: "official-ar",
        mint: tok.mint,
        network: "mainnet-beta",
        launchKind: "official",
        launchLifecycleStatus: "indexed",
        tokenName: tok.name,
        tokenSymbol: tok.symbol,
        tokenDescription: tok.description,
        tokenImageUrl: tok.imageUrl,
        creatorWallet: "92eXvBFGBAXwgmPf6t6CUCNJH2xChsCJuWzaGPjyPUmP",
        arTreasuryWallet: "92eXvBFGBAXwgmPf6t6CUCNJH2xChsCJuWzaGPjyPUmP",
        creatorShareBps: 8000,
        arShareBps: 2000,
        feeSharingStatus: "active",
        totalArFeesLamports: "0",
        totalCreatorFeesLamports: "0",
        totalFeesDistributedLamports: "0",
        lastDistributionAt: null,
        arTokenVerificationStatus: "verified",
        createdAt: now,
        updatedAt: now,
      } as unknown as PublicTokenDetailData["launch"],
      profile: {
        displayName: tok.name,
        shortDescription: tok.description,
        longDescription: tok.description,
        avatarUrl: tok.imageUrl,
        bannerUrl: null,
        website: tok.websiteUrl,
        twitter: tok.xUrl,
        telegram: tok.telegramUrl,
        github: null,
        tags: ["Ecosystem Token", "Staking", "Flywheel"],
      },
      linkedAgent: null,
      distributions: [],
      totals: {
        totalFeesDistributedLamports: "0",
        totalCreatorFeesLamports: "0",
        totalArFeesLamports: "0",
        lastDistributionAt: null,
      },
      networkLabel: "Mainnet",
      isMainnet: true,
      isDevnet: false,
      marketView: resolveMarketViewModel({
        isMainnet: true,
        mint: tok.mint,
        market,
        pumpFun: null,
      }),
      pumpFun: null,
      official: tok,
    };
  }

  const l = matchedCard.launch!;
  return {
    kind: "launched",
    launch: l.launch,
    profile: l.profile,
    linkedAgent: l.linkedAgent,
    distributions: [],
    totals: {
      totalFeesDistributedLamports: "2450000000",
      totalCreatorFeesLamports: "2205000000",
      totalArFeesLamports: "245000000",
      lastDistributionAt: new Date().toISOString(),
    },
    networkLabel: "Mainnet",
    isMainnet: true,
    isDevnet: false,
    marketView: resolveMarketViewModel({
      isMainnet: true,
      mint: l.launch.mint,
      market: l.market,
      pumpFun: null,
    }),
    pumpFun: null,
  };
}

export function buildDemoVerifiedDirectoryPage(
  page = 1,
  perPage = 25,
): VerifiedDirectoryPageData {
  const all = getAllDemoAgents().filter((a) => a.isVerified);
  const rows = all.map((seed) => {
    const cfg = getChainByChainId(seed.chainId);
    return {
      id: seed.id,
      agentId: seed.agentId,
      chainId: seed.chainId,
      name: seed.name,
      image: seed.image,
      slug: toAgentUrlSlug(seed.name),
      profilePath: agentPublicPath({
        chainId: seed.chainId,
        agentId: seed.agentId,
        name: seed.name,
      }),
      isVerified: seed.isVerified,
      isPremiumVerified: seed.isPremiumVerified,
      isVerifiedRevenue: Boolean(seed.token),
      perfLastComputedAt: seed.lastActiveAt,
      archetype: seed.archetype,
      archetypeAuto: seed.archetype,
      agentMode: seed.agentMode,
      protocolTrustScore: Math.round(seed.score),
      agentRankScore: seed.score,
      lastActiveAt: seed.lastActiveAt,
      listedAt: seed.createdAt,
      x402Support: seed.x402Support,
      chain: {
        name: cfg?.name ?? "Base",
        shortName: cfg?.shortName ?? "BASE",
        color: cfg?.color ?? "#0052FF",
        icon: cfg?.icon ?? "",
      },
      services: seed.services.map((s) => ({ name: s.name })),
      publishedMcpOfferCount: seed.mcpSupport ? 1 : 0,
      deploymentCount: 2,
      serviceCount: seed.services.length,
      devProofActive: Boolean(seed.socials.github),
      x402Detected: seed.x402Support,
      x402Payable: seed.x402Support,
      githubConnected: Boolean(seed.socials.github),
      devProofLastPushAt: seed.lastActiveAt,
      devProofLatestPushMessage: "feat: update ERC-8004 manifest & MCP tools",
    };
  });

  return {
    agents: rows,
    total: rows.length,
    page,
    perPage,
    totalPages: 1,
    generatedAt: new Date().toISOString(),
  };
}
