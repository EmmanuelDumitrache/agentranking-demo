import { DEMO_SEED_AGENTS } from "@/lib/demo-store";
import { DemoSectionView } from "@/components/dashboard/demo-dashboard-views";

export const dynamicParams = false;

export function generateStaticParams() {
  return DEMO_SEED_AGENTS.map((agent) => ({
    agentDbId: String(agent.id),
  }));
}

export default function DashboardAgentOverviewPage() {
  return <DemoSectionView section="overview" />;
}
