export type MockSolanaPublicKey = {
  toBase58: () => string;
  toString: () => string;
};

export function trySolanaPublicKey(address: string): MockSolanaPublicKey | null {
  const trimmed = address.trim();
  if (trimmed.length < 32 || trimmed.length > 44) return null;
  return {
    toBase58: () => trimmed,
    toString: () => trimmed,
  };
}

export function isValidSolanaMintString(address: string): boolean {
  return trySolanaPublicKey(address) !== null;
}

export type SolanaInjectedProvider = {
  isPhantom?: boolean;
  publicKey: MockSolanaPublicKey | null;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: MockSolanaPublicKey }>;
  disconnect: () => Promise<void>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
  signMessage?: (message: Uint8Array, display?: string) => Promise<{ signature: Uint8Array } | Uint8Array>;
};

const DEMO_PHANTOM_ADDRESS = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";

const demoProvider: SolanaInjectedProvider = {
  isPhantom: true,
  publicKey: {
    toBase58: () => DEMO_PHANTOM_ADDRESS,
    toString: () => DEMO_PHANTOM_ADDRESS,
  },
  connect: async () => ({
    publicKey: {
      toBase58: () => DEMO_PHANTOM_ADDRESS,
      toString: () => DEMO_PHANTOM_ADDRESS,
    },
  }),
  disconnect: async () => {},
  signMessage: async () => ({ signature: new Uint8Array(64).fill(7) }),
};

export function getSolanaWalletProvider(): SolanaInjectedProvider | undefined {
  if (typeof window === "undefined") return demoProvider;
  const w = window as Window & {
    solana?: SolanaInjectedProvider;
    phantom?: { solana?: SolanaInjectedProvider };
  };
  return w.phantom?.solana ?? w.solana ?? demoProvider;
}
