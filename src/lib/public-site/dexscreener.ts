export type TokenMarketSnapshot = {
  source: "dexscreener" | "pumpfun";
  chainId: string;
  pairAddress: string | null;
  pairUrl: string | null;
  dexId: string | null;
  priceUsd: number | null;
  marketCapUsd: number | null;
  fdvUsd: number | null;
  volume24hUsd: number | null;
  liquidityUsd: number | null;
  priceChange24hPct: number | null;
  txns24hBuys: number | null;
  txns24hSells: number | null;
  baseSymbol: string | null;
  quoteSymbol: string | null;
  pairCreatedAt: string | null;
  athMarketCapUsd: number | null;
  rawUpdatedAt: string;
};

export type DexscreenerChainId = "solana" | "robinhood";

const DEMO_AR_MARKET: TokenMarketSnapshot = {
  source: "dexscreener",
  chainId: "solana",
  pairAddress: "92eXvBFGBAXwgmPf6t6CUCNJH2xChsCJuWzaGPjyPUmP",
  pairUrl: "https://dexscreener.com/solana/92eXvBFGBAXwgmPf6t6CUCNJH2xChsCJuWzaGPjyPUmP",
  dexId: "raydium",
  priceUsd: 0.0248,
  marketCapUsd: 24_800_000,
  fdvUsd: 24_800_000,
  volume24hUsd: 3_420_000,
  liquidityUsd: 1_950_000,
  priceChange24hPct: 16.2,
  txns24hBuys: 1840,
  txns24hSells: 920,
  baseSymbol: "AR",
  quoteSymbol: "SOL",
  pairCreatedAt: "2026-06-01T00:00:00.000Z",
  athMarketCapUsd: 38_000_000,
  rawUpdatedAt: new Date().toISOString(),
};

export async function getDexscreenerMarketForMint(): Promise<TokenMarketSnapshot | null> {
  return DEMO_AR_MARKET;
}

export async function getDexscreenerMarketForRobinhoodToken(): Promise<TokenMarketSnapshot | null> {
  return DEMO_AR_MARKET;
}

export async function getDexscreenerMarketsForMints(
  mints: ReadonlyArray<string>,
): Promise<Map<string, TokenMarketSnapshot>> {
  const map = new Map<string, TokenMarketSnapshot>();
  for (const mint of mints) {
    map.set(mint, { ...DEMO_AR_MARKET, pairAddress: mint });
  }
  return map;
}

export async function getDexscreenerMarketsForAddresses(
  _chainId: DexscreenerChainId,
  addresses: ReadonlyArray<string>,
): Promise<Map<string, TokenMarketSnapshot>> {
  return getDexscreenerMarketsForMints(addresses);
}
