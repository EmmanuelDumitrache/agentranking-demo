import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEventLogs } from "viem";

const IDENTITY_REGISTRY_ABI = [
  {
    inputs: [{ internalType: "string", name: "agentURI", type: "string" }],
    name: "register",
    outputs: [{ internalType: "uint256", name: "agentId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "register",
    outputs: [{ internalType: "uint256", name: "agentId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "agentId", type: "uint256" },
      { internalType: "string", name: "newURI", type: "string" },
    ],
    name: "setAgentURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "agentId", type: "uint256" },
      { indexed: false, internalType: "string", name: "agentURI", type: "string" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
    ],
    name: "Registered",
    type: "event",
  },
] as const;

export const IDENTITY_REGISTRY_ADDRESS =
  "0x8004A818BFB912233c491871b3d84c89A494BD9e" as const;

export const SEPOLIA_CHAIN_ID = 11155111;

export function useRegisterAgent() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, data: receipt } =
    useWaitForTransactionReceipt({ hash });

  const register = (agentUri: string) => {
    writeContract({
      address: IDENTITY_REGISTRY_ADDRESS,
      abi: IDENTITY_REGISTRY_ABI,
      functionName: "register",
      args: [agentUri],
    });
  };

  // Parse agentId from receipt when available
  let agentId: number | undefined;
  if (receipt) {
    try {
      const logs = parseEventLogs({
        abi: IDENTITY_REGISTRY_ABI,
        logs: receipt.logs,
      });
      const registered = logs.find((l) => l.eventName === "Registered");
      if (registered && "args" in registered && registered.args.agentId != null) {
        agentId = Number(registered.args.agentId);
      }
    } catch {
      // ignore parse errors
    }
  }

  return {
    register,
    isPending: isPending || isConfirming,
    isSuccess,
    data: agentId != null ? { agentId } : undefined,
    hash,
    receipt,
  };
}
