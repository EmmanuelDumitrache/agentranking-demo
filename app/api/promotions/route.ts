import { NextRequest, NextResponse } from "next/server";
import {
  PAYMENT_TOKENS,
  PROMOTION_TIERS,
  type PaymentToken,
  type PromotionTier,
  type Promotion,
} from "@/lib/promotion-types";
import { isTransactionUsed, markTransactionUsed, storePromotion } from "@/lib/redis";
import { verifyTransaction } from "@/lib/verify-transaction";

const PROMOTION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { txHash, paymentToken, tier, agentId } = body as {
    txHash?: string;
    paymentToken?: string;
    tier?: string;
    agentId?: string;
  };

  if (!txHash || !paymentToken || !tier || !agentId) {
    return NextResponse.json(
      { error: "Missing required fields: txHash, paymentToken, tier, agentId" },
      { status: 400 }
    );
  }

  if (!PAYMENT_TOKENS.includes(paymentToken as PaymentToken)) {
    return NextResponse.json(
      { error: `Invalid paymentToken. Must be one of: ${PAYMENT_TOKENS.join(", ")}` },
      { status: 400 }
    );
  }

  if (!PROMOTION_TIERS.includes(tier as PromotionTier)) {
    return NextResponse.json(
      { error: `Invalid tier. Must be one of: ${PROMOTION_TIERS.join(", ")}` },
      { status: 400 }
    );
  }

  const used = await isTransactionUsed(txHash);
  if (used) {
    return NextResponse.json(
      { error: "Transaction hash has already been used" },
      { status: 409 }
    );
  }

  const result = await verifyTransaction(
    txHash,
    paymentToken as PaymentToken,
    tier as PromotionTier
  );

  if (!result.valid) {
    return NextResponse.json(
      { error: result.error ?? "Transaction verification failed" },
      { status: 400 }
    );
  }

  await markTransactionUsed(txHash);

  const now = Date.now();
  const promotion: Promotion = {
    id: `${agentId}-${tier}-${now}`,
    agentId,
    tier: tier as PromotionTier,
    paymentToken: paymentToken as PaymentToken,
    txHash,
    createdAt: now,
    expiresAt: now + PROMOTION_DURATION_MS,
  };

  await storePromotion(promotion);

  return NextResponse.json(
    { success: true, promotion },
    { status: 201 }
  );
}
