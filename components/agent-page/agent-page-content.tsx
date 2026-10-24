"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentHero } from "./agent-hero";
import {
  StatisticsCard,
  ContractStateEndpointsCard,
  OnChainOffChainCard,
  CapabilitiesTagsCard,
  TimestampsCard,
  RecentValidationsCard,
} from "./agent-cards";
import { FeedbackSection } from "./agent-section-feedback";
import { ReputationSection } from "./agent-section-reputation";
import { ValidationSection } from "./agent-section-validation";
import { MetadataSection } from "./agent-section-metadata";
import { createdAgentToAgentData, type AgentData } from "@/lib/agent-data";
import { useCreatedAgentsStore } from "@/stores/created-agents-store";

export type AgentSectionTab = "overview" | "feedback" | "reputation" | "validation" | "metadata";

export function AgentPageContent({ agent: serverAgent }: { agent: AgentData }) {
  const [section, setSection] = useState<AgentSectionTab>("overview");
  const createdAgents = useCreatedAgentsStore((s) => s.agents);

  const agent = useMemo(() => {
    const custom = createdAgents.find(
      (a) => Number(a.agentId) === Number(serverAgent.agentId)
    );
    if (custom) {
      return createdAgentToAgentData(custom);
    }
    return serverAgent;
  }, [createdAgents, serverAgent]);

  return (
    <div
      className="mx-auto w-full"
      style={{
        maxWidth: "calc(100% - 1rem)",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
      }}
    >
      <AgentHero agent={agent} />

      <Tabs
        value={section}
        onValueChange={(v) => setSection(v as AgentSectionTab)}
        className="mt-6 w-full"
      >
        <TabsList
          className="flex !h-auto min-h-0 w-full flex-wrap justify-center border-0 bg-transparent px-0"
          style={{ gap: "2.5rem", paddingTop: "2rem", paddingBottom: "2rem" }}
        >
          <TabsTrigger
            value="overview"
            className="rounded-none border-0 bg-transparent px-0 font-normal text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:font-medium data-[state=active]:text-foreground"
            style={{ fontSize: "1.25rem", paddingTop: "0.875rem", paddingBottom: "0.875rem" }}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="feedback"
            className="rounded-none border-0 bg-transparent px-0 font-normal text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:font-medium data-[state=active]:text-foreground"
            style={{ fontSize: "1.25rem", paddingTop: "0.875rem", paddingBottom: "0.875rem" }}
          >
            Feedback
          </TabsTrigger>
          <TabsTrigger
            value="reputation"
            className="rounded-none border-0 bg-transparent px-0 font-normal text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:font-medium data-[state=active]:text-foreground"
            style={{ fontSize: "1.25rem", paddingTop: "0.875rem", paddingBottom: "0.875rem" }}
          >
            Reputation
          </TabsTrigger>
          <TabsTrigger
            value="validation"
            className="rounded-none border-0 bg-transparent px-0 font-normal text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:font-medium data-[state=active]:text-foreground"
            style={{ fontSize: "1.25rem", paddingTop: "0.875rem", paddingBottom: "0.875rem" }}
          >
            Validation
          </TabsTrigger>
          <TabsTrigger
            value="metadata"
            className="rounded-none border-0 bg-transparent px-0 font-normal text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:font-medium data-[state=active]:text-foreground"
            style={{ fontSize: "1.25rem", paddingTop: "0.875rem", paddingBottom: "0.875rem" }}
          >
            Metadata
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {section === "overview" && (
            <div className="space-y-[3.5rem]">
              <div
                className="grid w-full grid-cols-1 lg:grid-cols-[3fr_7fr]"
                style={{ gap: "1.5rem" }}
              >
                <StatisticsCard agent={agent} />
                <ContractStateEndpointsCard agent={agent} />
              </div>
              <OnChainOffChainCard agent={agent} />
              <div className="grid grid-cols-1 gap-[2rem] min-[900px]:grid-cols-2">
                <CapabilitiesTagsCard agent={agent} />
                <TimestampsCard agent={agent} />
              </div>
              <RecentValidationsCard agent={agent} />
            </div>
          )}
          {section === "feedback" && <FeedbackSection agent={agent} />}
          {section === "reputation" && <ReputationSection agent={agent} />}
          {section === "validation" && <ValidationSection agent={agent} />}
          {section === "metadata" && <MetadataSection agent={agent} />}
        </div>
      </Tabs>
    </div>
  );
}
