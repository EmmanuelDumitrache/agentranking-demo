import type {
  CreateAgentFormState,
  TrustMechanism,
} from "./create-agent-types";

/**
 * Build ERC 8004 compliant agent metadata JSON.
 * @see https://eips.ethereum.org/EIPS/eip-8004
 */
export function buildAgentMetadata(
  state: CreateAgentFormState,
  agentId?: number,
  agentRegistry?: string
): object {
  const services: Array<Record<string, unknown>> = state.services
    .filter((s) => s.endpoint.trim())
    .map((s) => {
      const base: Record<string, unknown> = {
        name: s.name,
        endpoint: s.endpoint.trim(),
      };
      if (s.version) base.version = s.version;
      if (s.skills?.length) base.skills = s.skills;
      if (s.domains?.length) base.domains = s.domains;
      return base;
    });

  // Add OASF service if we have skills/domains but no OASF endpoint
  const hasOasfService = services.some(
    (s) => (s.name as string).toLowerCase() === "oasf"
  );
  if (
    !hasOasfService &&
    (state.skills.length > 0 || state.domains.length > 0)
  ) {
    services.push({
      name: "OASF",
      endpoint: "https://github.com/agntcy/oasf/",
      version: "0.8.0",
      skills: state.skills.length ? state.skills : undefined,
      domains: state.domains.length ? state.domains : undefined,
    });
  }

  const metadata: Record<string, unknown> = {
    type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
    name: state.name.trim() || "",
    description: state.description.trim() || "",
    image: state.imageUrl.trim() || "",
    services,
    x402Support: state.x402Support,
    active: state.active,
  };

  if (state.tags.length > 0) {
    metadata.tags = state.tags;
  }

  if (agentId != null && agentRegistry) {
    metadata.registrations = [
      {
        agentId,
        agentRegistry,
      },
    ];
  }

  if (state.supportedTrust.length > 0) {
    metadata.supportedTrust = state.supportedTrust.map(
      (t: TrustMechanism) =>
        t === "tee-attestation" ? "tee-attestation" : t
    );
  }

  return metadata;
}
