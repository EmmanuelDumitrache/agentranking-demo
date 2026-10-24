import { DEMO_SEED_AGENTS } from "@/lib/demo-store";
import { DemoSectionView } from "@/components/dashboard/demo-dashboard-views";
import type { DashboardWorkspaceSection } from "@/lib/dashboard/navigation";

export const dynamicParams = false;

const STATIC_AGENT_IDS = Array.from(
  new Set([
    ...DEMO_SEED_AGENTS.map((agent) => agent.id),
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
  ]),
);

const TRADE_SUBS = ["terminal", "swap", "perps", "copy"] as const;

export function generateStaticParams() {
  const params: Array<{ agentDbId: string; sub: string }> = [];
  for (const id of STATIC_AGENT_IDS) {
    for (const sub of TRADE_SUBS) {
      params.push({
        agentDbId: String(id),
        sub,
      });
    }
  }
  return params;
}

export default async function DashboardAgentTradeSubPage({
  params,
}: {
  readonly params: Promise<{ agentDbId: string; sub: string }>;
}) {
  const { sub } = await params;
  return <DemoSectionView section={`trade-${sub}` as DashboardWorkspaceSection} />;
}
