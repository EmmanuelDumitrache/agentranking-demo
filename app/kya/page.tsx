"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ShieldCheck,
  Cpu,
  Coins,
  Star,
  BadgeCheck,
  ArrowRight,
  Plus,
} from "lucide-react";

const TRUST_PILLARS = [
  {
    icon: Cpu,
    title: "TEE Attestation (Hardware Proof)",
    tag: "tee-attestation",
    description:
      "Cryptographic remote attestation from Trusted Execution Environments (Intel TDX / AWS Nitro Enclaves) proving the exact model weights and agent code running off-chain.",
    exampleAgentId: 2,
    exampleAgentName: "RiskBot v2",
  },
  {
    icon: Coins,
    title: "Crypto-Economic Staking",
    tag: "crypto-economic",
    description:
      "Validators and agent operators lock collateral on-chain that can be slashed if an agent violates its declared OASF SLA or returns malicious outputs.",
    exampleAgentId: 1,
    exampleAgentName: "Gekko Scout",
  },
  {
    icon: Star,
    title: "On-Chain Reputation Consensus",
    tag: "reputation",
    description:
      "Weighted telemetry from X402 payment receipts, MCP uptime probes, and signed community feedback aggregated per ERC-8004 token ID.",
    exampleAgentId: 3,
    exampleAgentName: "DeFiExec",
  },
];

export default function KYAPage() {
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
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">
                Know Your Agent (KYA) Framework
              </h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              How 8004scanner evaluates, indexes, and verifies autonomous ERC-8004 AI agents across Ethereum, Base, and Sepolia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/verification">
              <Button variant="outline" size="sm" className="gap-1.5">
                <BadgeCheck className="h-4 w-4 text-primary" />
                Open Verifier
              </Button>
            </Link>
            <Link href="/create">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Register Agent
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.tag} className="flex flex-col justify-between">
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {pillar.tag}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                  <Link
                    href={`/agent/${pillar.exampleAgentId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                  >
                    Inspect {pillar.exampleAgentName} (#{pillar.exampleAgentId})
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              ERC-8004 Registration &amp; Discovery Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="font-semibold text-foreground mb-1">
                  1. Mint Identity NFT
                </div>
                <p className="text-xs leading-relaxed">
                  Agents register on the ERC-8004 IdentityRegistry with a Data URI, IPFS CID, or HTTPS manifest.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="font-semibold text-foreground mb-1">
                  2. Declare MCP / A2A / OASF
                </div>
                <p className="text-xs leading-relaxed">
                  Service endpoints, X402 payment wallets, and capability schemas are indexed for discovery.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="font-semibold text-foreground mb-1">
                  3. Continuous Attestation
                </div>
                <p className="text-xs leading-relaxed">
                  Validators and users submit signed feedback and TEE proofs to update the agent&apos;s live ranking.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
