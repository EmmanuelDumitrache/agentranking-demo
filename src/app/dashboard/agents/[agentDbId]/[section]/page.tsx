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
  for (const id of STATIC_AGENT_IDS) {
    for (const section of AGENT_SECTIONS) {
      params.push({
        agentDbId: String(id),
        section,
      });
    }
  }
  return params;
}

export default async function DashboardAgentSectionPage({
  params,
}: {
  readonly params: Promise<{ agentDbId: string; section: string }>;
}) {
  const { section } = await params;
  const resolved: DashboardWorkspaceSection =
    section === "trade"
      ? "trade-terminal"
      : (section as DashboardWorkspaceSection);
  return <DemoSectionView section={resolved} />;
}
