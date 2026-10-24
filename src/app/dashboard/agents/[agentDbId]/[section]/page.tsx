import { DEMO_SEED_AGENTS } from "@/lib/demo-store";
import { DemoSectionView } from "@/components/dashboard/demo-dashboard-views";

export const dynamicParams = false;

const AGENT_SECTIONS = [
  "chat",
  "launchpad",
  "schedule",
  "wallet",
  "register",
  "memory",
  "inference",
  "services",
  "connections",
  "github",
  "monetize",
  "analytics",
  "rankings",
  "health",
  "social",
  "verify",
  "trade",
] as const;

export function generateStaticParams() {
  const params: Array<{ agentDbId: string; section: string }> = [];
  for (const agent of DEMO_SEED_AGENTS) {
    for (const section of AGENT_SECTIONS) {
      params.push({
        agentDbId: String(agent.id),
        section,
      });
    }
  }
  return params;
}

export default function DashboardAgentSectionPage() {
  return <DemoSectionView />;
}
