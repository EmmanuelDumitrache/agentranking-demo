import { DEMO_SEED_AGENTS } from "@/lib/demo-store";
import { DemoSectionView } from "@/components/dashboard/demo-dashboard-views";

export const dynamicParams = false;

const TRADE_SUBS = ["terminal", "swap", "perps", "copy"] as const;

export function generateStaticParams() {
  const params: Array<{ agentDbId: string; sub: string }> = [];
  for (const agent of DEMO_SEED_AGENTS) {
    for (const sub of TRADE_SUBS) {
      params.push({
        agentDbId: String(agent.id),
        sub,
      });
    }
  }
  return params;
}

export default function DashboardAgentTradeSubPage() {
  return <DemoSectionView />;
}
