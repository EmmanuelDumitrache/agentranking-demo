import type { Metadata } from "next";
import { DemoDashboardShell } from "@/components/dashboard/demo-dashboard-shell";

export const metadata: Metadata = {
  title: "Creator Workspace — AgentRanking Dashboard",
  description: "Create agents, launch tokens, and manage on-chain revenue from one workspace.",
};

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <DemoDashboardShell>{children}</DemoDashboardShell>;
}
