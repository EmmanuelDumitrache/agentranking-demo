import {
  getSolanaWalletProvider,
  type MockSolanaPublicKey,
  type SolanaInjectedProvider,
} from "@/lib/ar-token-ledger";

export const DEFAULT_CONNECT_TIMEOUT_MS = 20_000;
export type InjectedWalletConnectErrorCode = "no_provider" | "timeout" | "cancelled" | "unknown";

export class InjectedWalletConnectError extends Error {
  readonly code: InjectedWalletConnectErrorCode;
  constructor(message: string, code: InjectedWalletConnectErrorCode) {
    super(message);
    this.name = "InjectedWalletConnectError";
    this.code = code;
  }
}

export async function connectInjectedWallet(): Promise<{
  publicKey: MockSolanaPublicKey;
  provider: SolanaInjectedProvider;
}> {
  const provider = getSolanaWalletProvider()!;
  const res = await provider.connect();
  return { publicKey: res.publicKey, provider };
}

export function subscribeInjectedWalletAccount(callbacks: {
  onAccountChange: (publicKey: MockSolanaPublicKey | null) => void;
  onDisconnect?: () => void;
}): () => void {
  const provider = getSolanaWalletProvider();
  if (provider?.publicKey) {
    callbacks.onAccountChange(provider.publicKey);
  }
  return () => {};
}
