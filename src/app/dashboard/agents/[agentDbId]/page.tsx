import { DEMO_SEED_AGENTS } from "@/lib/demo-store";
import { DemoSectionView } from "@/components/dashboard/demo-dashboard-views";

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

export function generateStaticParams() {
  return STATIC_AGENT_IDS.map((id) => ({
    agentDbId: String(id),
  }));
}

export default function DashboardAgentOverviewPage() {
  return <DemoSectionView section="overview" />;
}
