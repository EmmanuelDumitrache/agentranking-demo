import { DemoSectionView } from "@/components/dashboard/demo-dashboard-views";

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

export default function DashboardWorkspaceSectionPage() {
  return <DemoSectionView />;
}
