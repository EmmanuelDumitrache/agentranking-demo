export type PaymentToken = "ETH" | "USDC" | "SOL";
export type PromotionTier = "hot" | "featured";

export const PAYMENT_TOKENS: PaymentToken[] = ["ETH", "USDC", "SOL"];
export const PROMOTION_TIERS: PromotionTier[] = ["hot", "featured"];

export interface TierPrices {
  eth_base: string;
  usdc_base: string;
  sol: string;
}

export interface PromotionPrices {
  hot: TierPrices;
  featured: TierPrices;
}

export const PROMOTION_PRICES: PromotionPrices = {
  hot: {
    eth_base: "0.05",
    usdc_base: "100",
    sol: "0.8",
  },
  featured: {
    eth_base: "0.1",
    usdc_base: "200",
    sol: "1.6",
  },
};

export interface Promotion {
  id: string;
  agentId: string;
  tier: PromotionTier;
  paymentToken: PaymentToken;
  txHash: string;
  createdAt: number;
  expiresAt: number;
}

/** Maps PaymentToken to the key in TierPrices for price lookup */
export function getPriceForToken(
  tier: PromotionTier,
  token: PaymentToken
): string {
  const tierPrices = PROMOTION_PRICES[tier];
  switch (token) {
    case "ETH":
      return tierPrices.eth_base;
    case "USDC":
      return tierPrices.usdc_base;
    case "SOL":
      return tierPrices.sol;
  }
}
