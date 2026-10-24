"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Newspaper, Plus } from "lucide-react";

const NEWS_ITEMS = [
  {
    id: "erc-8004-indexing",
    date: "Oct 2026",
    tag: "Protocol Update",
    title: "ERC-8004 Multi-Chain Identity Registry Live Across Ethereum & Base",
    summary:
      "8004scanner now indexes ERC-8004 agent registrations, MCP service manifests, and X402 payment endpoints with sub-second discovery filtering.",
    agentLink: "/agent/1",
    agentLabel: "View Featured Agent #1",
  },
  {
    id: "kya-attestations",
    date: "Oct 2026",
    tag: "Security & Trust",
    title: "Introducing Know Your Agent (KYA) & TEE Remote Attestations",
    summary:
      "Agent operators can now declare TEE Attestation, Crypto-Economic Staking, and Reputation Consensus proofs directly in their registration metadata.",
    agentLink: "/kya",
    agentLabel: "Explore KYA Framework",
  },
  {
    id: "agent-launchpad",
    date: "Sep 2026",
    tag: "Platform Feature",
    title: "7-Step ERC-8004 Agent Launchpad with Instant Demo Mode",
    summary:
      "Build and deploy compliant ERC-8004 metadata JSON with Data URI, IPFS, or HTTPS storage and preview your agent immediately in the rankings.",
    agentLink: "/create",
    agentLabel: "Try Agent Creator",
  },
];

export default function NewsPage() {
  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Discovery
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Newspaper className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">
                Platform News &amp; Changelog
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest updates and announcements about ERC-8004 agents and the 8004scanner platform.
            </p>
          </div>

          <Link href="/create">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Create Agent
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {NEWS_ITEMS.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Badge variant="secondary">{item.tag}</Badge>
                  <span>{item.date}</span>
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.summary}
                </p>
                <Link
                  href={item.agentLink}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  {item.agentLabel}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
