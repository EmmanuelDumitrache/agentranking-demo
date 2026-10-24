import type { PaymentToken, PromotionTier } from "./promotion-types";

interface VerificationResult {
  valid: boolean;
  error?: string;
  timestamp?: number;
}

/**
 * Lightweight demo transaction verifier.
 * Accepts demo transaction hashes (`0xdemo...`, `demo_...`, or valid-looking EVM/Solana tx hashes)
 * so the promotion flow works out-of-the-box on Netlify without requiring live RPC/API keys.
 */
export async function verifyTransaction(
  txHash: string,
  paymentToken: PaymentToken,
  _tier: PromotionTier
): Promise<VerificationResult> {
  const trimmed = txHash.trim();

  if (!trimmed || trimmed.length < 8) {
    return {
      valid: false,
      error: "Please enter a valid transaction hash or click 'Use Demo Transaction'.",
    };
  }

  // Always accept demo transaction hashes
  if (
    trimmed.toLowerCase().startsWith("0xdemo") ||
    trimmed.toLowerCase().startsWith("demo_")
  ) {
    return { valid: true, timestamp: Date.now() };
  }

  if (paymentToken === "SOL") {
    if (trimmed.length < 32) {
      return {
        valid: false,
        error: "Invalid Solana signature format (must be base58 signature or demo hash).",
      };
    }
    return { valid: true, timestamp: Date.now() };
  }

  // ETH or USDC
  if (!trimmed.startsWith("0x") || trimmed.length < 16) {
    return {
      valid: false,
      error: "Invalid EVM transaction hash (must start with 0x).",
    };
  }

  return { valid: true, timestamp: Date.now() };
}
