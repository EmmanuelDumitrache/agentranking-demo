import {
  DEFAULT_STREAMFLOW_STAKE_POOL,
  DEFAULT_STREAMFLOW_STAKE_POOL_MINT,
  type StreamflowPoolConfigDto,
} from "@/lib/streamflow-stake-config";
import { resolveArSolanaMint } from "@/lib/ar-token-public";

export async function readStreamflowPoolConfig(): Promise<StreamflowPoolConfigDto | null> {
  return {
    poolAddress: DEFAULT_STREAMFLOW_STAKE_POOL,
    stakeMint: DEFAULT_STREAMFLOW_STAKE_POOL_MINT,
    underlyingMint: resolveArSolanaMint(),
    constraints: {
      min: String(7 * 86_400),
      max: String(365 * 86_400),
    },
    decimals: 6,
    fetchedAt: new Date().toISOString(),
  };
}
