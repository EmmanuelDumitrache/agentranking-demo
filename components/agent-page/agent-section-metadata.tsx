"use client";

import { OnChainOffChainCard } from "./agent-cards";
import type { AgentData } from "@/lib/agent-data";

export function MetadataSection({ agent }: { agent: AgentData }) {
  return (
    <div className="space-y-[3.5rem]">
      <OnChainOffChainCard agent={agent} />
    </div>
  );
}
