import type { AgentData } from "@/lib/agent-data";

export function AgentJsonLd({ agent }: { agent: AgentData }) {
  const name = agent.metadata.name ?? `Agent #${agent.agentId}`;
  const description = agent.metadata.description ?? "";
  const image = agent.metadata.image;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://8004scanner.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description: description || undefined,
    image: image || undefined,
    url: `${baseUrl}/agent/${agent.agentId}`,
    applicationCategory: "AI Agent",
    operatingSystem: "Blockchain",
    identifier: {
      "@type": "PropertyValue",
      name: "ERC-8004 Agent ID",
      value: String(agent.agentId),
    },
    ...(agent.metadata.tags && agent.metadata.tags.length > 0 && {
      keywords: agent.metadata.tags.join(", "),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
