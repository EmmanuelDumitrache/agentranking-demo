import { DemoSectionView } from "@/components/dashboard/demo-dashboard-views";
import type { DashboardWorkspaceSection } from "@/lib/dashboard/navigation";

export const dynamicParams = false;

const WORKSPACE_SECTIONS = [
  "wallet",
  "verify",
  "credentials",
  "connections",
  "card",
  "x402-market",
  "referrals",
  "settings",
] as const;

export function generateStaticParams() {
  return WORKSPACE_SECTIONS.map((workspaceSection) => ({
    workspaceSection,
  }));
}

export default async function DashboardWorkspaceSectionPage({
  params,
}: {
  readonly params: Promise<{ workspaceSection: string }>;
}) {
  const { workspaceSection } = await params;
  return <DemoSectionView section={workspaceSection as DashboardWorkspaceSection} />;
}
