"use client";
import { useCallback, useState } from "react";
import { showToast } from "@/components/ui/toast-simple";

const DEMO_PUBKEY = {
  toBase58: () => "DemoSolWallet9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
};

export function useStakingPhantomConnect() {
  const [connected, setConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const connectPhantom = useCallback(async () => {
    setError(null);
    setConnected(true);
    showToast("Demo Solana wallet connected", "success");
  }, []);

  const disconnectPhantom = useCallback(async () => {
    setError(null);
    setConnected(false);
  }, []);

  return {
    publicKey: connected ? DEMO_PUBKEY : null,
    connected,
    adapterReady: connected,
    connectPhantom,
    disconnectPhantom,
    connecting: false,
    error,
    clearError: () => setError(null),
  };
}
