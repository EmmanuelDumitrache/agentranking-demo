import type { serializeAgentLaunch, serializeAgentLaunchDistribution } from "@/lib/agent-launch/serialize";
import type { LaunchLinkedAgentSummary } from "@/lib/agent-launch/linked-agent";
import type { LaunchDisplayProfile } from "@/lib/agent-launch/launch-profile";
import type { PublicTokenMarketViewModel } from "@/lib/public-site/market-view-model";
import type { PumpFunBondingData } from "@/lib/public-site/pumpfun-bonding";
import type { OfficialPublicToken } from "@/lib/public-site/official-tokens";
import { buildDemoTokenDetailData } from "@/lib/demo-store";

export type PublicTokenDetailData = {
  kind: "launched" | "official";
  launch: ReturnType<typeof serializeAgentLaunch>;
  profile: LaunchDisplayProfile;
  linkedAgent: LaunchLinkedAgentSummary | null;
  distributions: ReturnType<typeof serializeAgentLaunchDistribution>[];
  totals: {
    totalFeesDistributedLamports: string;
    totalCreatorFeesLamports: string;
    totalArFeesLamports: string;
    lastDistributionAt: string | null;
  };
  networkLabel: string;
  isMainnet: boolean;
  isDevnet: boolean;
  marketView: PublicTokenMarketViewModel;
  pumpFun: PumpFunBondingData | null;
  official?: OfficialPublicToken;
};

export async function loadPublicTokenDetailData(mint: string): Promise<PublicTokenDetailData> {
  return buildDemoTokenDetailData(mint);
}
