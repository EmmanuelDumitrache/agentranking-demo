import { trySolanaPublicKey } from "@/lib/ar-token-ledger";
import {
  TOKEN_DESCRIPTION_MAX_LENGTH,
  TOKEN_NAME_MAX_LENGTH,
  TOKEN_SYMBOL_MAX_LENGTH,
} from "@/lib/agent-launch/constants";

export function validateSolanaPubkey(
  value: string | undefined,
  label: string,
): string | null {
  if (!value?.trim()) return `${label} is required`;
  if (!trySolanaPublicKey(value.trim())) {
    return `${label} must be a valid Solana public key`;
  }
  return null;
}

export function validateTokenName(name: string | undefined): string | null {
  if (name === undefined) return null;
  const trimmed = name.trim();
  if (!trimmed) return "Token name is required";
  if (trimmed.length > TOKEN_NAME_MAX_LENGTH) {
    return `Token name must be at most ${TOKEN_NAME_MAX_LENGTH} characters`;
  }
  return null;
}

export function validateTokenSymbol(symbol: string | undefined): string | null {
  if (symbol === undefined) return null;
  const trimmed = symbol.trim().toUpperCase();
  if (!trimmed) return "Token symbol is required";
  if (trimmed.length > TOKEN_SYMBOL_MAX_LENGTH) {
    return `Token symbol must be at most ${TOKEN_SYMBOL_MAX_LENGTH} characters`;
  }
  if (!/^[A-Z0-9]+$/.test(trimmed)) {
    return "Token symbol must be alphanumeric";
  }
  return null;
}

export function validateTokenDescription(description: string | undefined): string | null {
  if (description === undefined) return null;
  const trimmed = description.trim();
  if (!trimmed) return "Token description is required";
  if (trimmed.length > TOKEN_DESCRIPTION_MAX_LENGTH) {
    return `Token description must be at most ${TOKEN_DESCRIPTION_MAX_LENGTH} characters`;
  }
  return null;
}
