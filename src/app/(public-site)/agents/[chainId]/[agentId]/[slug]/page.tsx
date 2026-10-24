import {
  generatePublicAgentDetailMetadata,
  PublicAgentDetailRoute,
} from "@/lib/public-site/agent-detail-page.server";
import { DEMO_SEED_AGENTS } from "@/lib/demo-store";
import { toAgentUrlSlug } from "@/lib/agent-public-url";

export function generateStaticParams() {
  return DEMO_SEED_AGENTS.map((agent) => ({
    chainId: String(agent.chainId),
    agentId: String(agent.agentId),
    slug: toAgentUrlSlug(agent.name),
  }));
}

export const generateMetadata = generatePublicAgentDetailMetadata;
export default PublicAgentDetailRoute;
