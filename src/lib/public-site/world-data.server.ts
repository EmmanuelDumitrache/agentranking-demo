import { buildLocalAgentWorldMockSnapshot } from "@/lib/public-site/world-mock-data.server";
import type { AgentWorldSnapshot } from "@/lib/public-site/world-types";

export type {
  AgentWorldAgentPreview,
  AgentWorldArCluster,
  AgentWorldChainCluster,
  AgentWorldSnapshot,
  AgentWorldTotals,
} from "@/lib/public-site/world-types";
export { AGENT_WORLD_AR_CHAIN_ID } from "@/lib/public-site/world-types";

export async function loadAgentWorldSnapshot(): Promise<AgentWorldSnapshot> {
  return buildLocalAgentWorldMockSnapshot();
}
