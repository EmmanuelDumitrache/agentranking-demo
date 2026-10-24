import { parsePublicAgentId, parsePublicChainId } from "@/lib/agent-public-identity";
import { agentPublicPath, toAgentUrlSlug } from "@/lib/agent-public-url";
import { resolveOrSynthesizeDemoAgent } from "@/lib/demo-store";
export { parsePublicAgentId, parsePublicChainId } from "@/lib/agent-public-identity";

export type PublicAgentRouteIdentity = {
  id: number;
  chainId: number;
  agentId: number;
  name: string;
  publiclyActive: boolean;
  moderationStatus: string;
  administrativeActiveOverride: boolean | null;
  sourceActive: boolean | null;
  isActive: boolean;
};

export type ResolvedPublicAgentRoute = {
  identity: PublicAgentRouteIdentity;
  canonicalSlug: string;
  canonicalPath: string;
};

export async function loadPublicAgentRouteIdentity(
  chainId: number,
  agentId: number,
): Promise<PublicAgentRouteIdentity | null> {
  const agent = resolveOrSynthesizeDemoAgent(chainId, agentId);
  return {
    id: agent.id,
    chainId: agent.chainId,
    agentId: agent.agentId,
    name: agent.name,
    publiclyActive: true,
    moderationStatus: "active",
    administrativeActiveOverride: null,
    sourceActive: true,
    isActive: true,
  };
}

export async function resolvePublicAgentRoute(input: {
  rawChainId: string;
  rawAgentId: string;
  requestedSlug: string;
}): Promise<ResolvedPublicAgentRoute | null> {
  const chainId = parsePublicChainId(input.rawChainId) ?? 8453;
  const agentId = parsePublicAgentId(input.rawAgentId) ?? 101;
  const seed = resolveOrSynthesizeDemoAgent(chainId, agentId, input.requestedSlug);
  const identity: PublicAgentRouteIdentity = {
    id: seed.id,
    chainId: seed.chainId,
    agentId: seed.agentId,
    name: seed.name,
    publiclyActive: true,
    moderationStatus: "active",
    administrativeActiveOverride: null,
    sourceActive: true,
    isActive: true,
  };
  return {
    identity,
    canonicalSlug: toAgentUrlSlug(seed.name),
    canonicalPath: agentPublicPath(identity),
  };
}
