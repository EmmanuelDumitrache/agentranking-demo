import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAgentData } from "@/lib/agent-data";
import { AgentJsonLd, AgentPageContent } from "@/components/agent-page";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const agent = await getAgentData(id);

  if (!agent) {
    return { title: "Agent Not Found | 8004scanner" };
  }

  const name = agent.metadata.name ?? `Agent #${agent.agentId}`;
  const description = agent.metadata.description
    ? agent.metadata.description.slice(0, 155) +
      (agent.metadata.description.length > 155 ? "..." : "")
    : `ERC-8004 AI Agent ${name} on ${agent.chainName}`;
  const image = agent.metadata.image;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://8004scanner.com";

  return {
    title: `${name} | 8004scanner - ERC-8004 Agent`,
    description,
    openGraph: {
      title: `${name} | 8004scanner - ERC-8004 Agent`,
      description,
      images: image ? [{ url: image }] : undefined,
      url: `${baseUrl}/agent/${agent.agentId}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | 8004scanner - ERC-8004 Agent`,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/agent/${agent.agentId}`,
    },
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = await getAgentData(id);

  if (!agent) {
    notFound();
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <AgentJsonLd agent={agent} />
      <main
        className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden py-4 md:py-6"
        style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
      >
        <AgentPageContent agent={agent} />
      </main>
    </div>
  );
}
