import type { Promotion } from "./promotion-types";

// Lightweight in-memory store for zero-config Netlify demo deployment
const usedTransactions = new Set<string>();
const promotionsById = new Map<string, Promotion>();
const promotionsByAgent = new Map<string, Set<string>>();

export async function isTransactionUsed(txHash: string): Promise<boolean> {
  return usedTransactions.has(txHash.toLowerCase());
}

export async function markTransactionUsed(txHash: string): Promise<void> {
  usedTransactions.add(txHash.toLowerCase());
}

export async function storePromotion(promotion: Promotion): Promise<void> {
  promotionsById.set(promotion.id, promotion);
  const existing = promotionsByAgent.get(promotion.agentId) ?? new Set<string>();
  existing.add(promotion.id);
  promotionsByAgent.set(promotion.agentId, existing);
}

export async function getPromotions(agentId: string): Promise<Promotion[]> {
  const ids = promotionsByAgent.get(agentId);
  if (!ids || ids.size === 0) return [];

  const promotions: Promotion[] = [];
  for (const id of ids) {
    const promo = promotionsById.get(id);
    if (promo && promo.expiresAt > Date.now()) {
      promotions.push(promo);
    }
  }
  return promotions;
}
