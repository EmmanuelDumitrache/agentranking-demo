import { getAgentLaunchFeeDisplayConfig } from "@/lib/agent-launch/config";
import type { PublicLaunchChain } from "@/lib/public-launch/initial-state";

export async function readPublicQuickLaunchInitialState(input: {
  chain: PublicLaunchChain;
  attemptId?: string | null;
}) {
  return {
    walletSession: {
      authenticated: true,
      wallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      chain: input.chain === "robinhood" ? ("evm" as const) : ("solana" as const),
      expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
    },
    robinhoodLaunchFeeEth: "0.001",
    feeDisplay: getAgentLaunchFeeDisplayConfig(),
    openMetaplexAttempt: null,
  };
}
