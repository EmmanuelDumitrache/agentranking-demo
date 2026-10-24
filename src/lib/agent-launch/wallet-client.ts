"use client";

import {
  connectInjectedWallet,
  subscribeInjectedWalletAccount,
} from "@/lib/solana-injected-wallet";
import { getSolanaWalletProvider } from "@/lib/ar-token-ledger";

export type WalletNetworkHint = "devnet" | "mainnet-beta" | "testnet" | "unknown";
export { subscribeInjectedWalletAccount };

export function generateMintKeypair() {
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  const mint = `AR${rand}7xKXtg2CW87d97TXJSDpbD5jBkheTqpump`;
  return {
    publicKey: {
      toBase58: () => mint,
      toString: () => mint,
    },
    secretKey: new Uint8Array(64).fill(1),
  };
}

export function isPhantomAvailable(): boolean {
  return true;
}

export async function connectAgentLaunchWallet() {
  return connectInjectedWallet();
}

export async function disconnectAgentLaunchWallet(): Promise<void> {}

export function getConnectedWalletAddress(): string | null {
  return (
    getSolanaWalletProvider()?.publicKey?.toBase58() ??
    "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
  );
}

export async function detectWalletNetworkHint(): Promise<WalletNetworkHint> {
  return "mainnet-beta";
}

export async function fetchDevnetSolBalance(): Promise<bigint> {
  return BigInt(12_500_000_000); // 12.5 SOL demo balance
}

export async function fundAddressFromConnectedWallet(input: {
  toAddress: string;
  lamports: number;
}): Promise<{ signature: string; lamportsSent: number }> {
  return {
    signature: `5DemoSig${Date.now().toString(36)}SolanaTx`,
    lamportsSent: input.lamports,
  };
}

export async function signAndSendAgentLaunchTransaction(): Promise<string> {
  return `5DemoSig${Date.now().toString(36)}SolanaTx`;
}
