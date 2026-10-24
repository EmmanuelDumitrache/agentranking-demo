import type { PublicStakeSummary } from "@/lib/public-stake-summary";
import type { StakePageMetricsDto } from "@/lib/stake-page-data";
import { buildDemoStakeSummary } from "@/lib/demo-store";

export async function readStakePageMetrics(): Promise<StakePageMetricsDto> {
  return {
    generatedAt: new Date().toISOString(),
    totals: {
      totalBurnedToken: 14_250_000,
      totalBuybackUsd: 482_900,
      totalRewardsToken: 18_500_000,
      totalBountyRewardsToken: 25_000_000,
      totalRevenueUsd: 767_750,
      treasuryNetUsd: 412_000,
      liquidityNetToken: 85_000_000,
      stakedSupplyToken: 142_850_000,
      activeStakers: 1_428,
    },
  };
}

export async function readPublicStakeSummary(): Promise<PublicStakeSummary> {
  return buildDemoStakeSummary();
}
