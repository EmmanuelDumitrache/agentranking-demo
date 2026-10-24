"use client";

import { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  Search,
  Shield,
  ArrowRight,
} from "lucide-react";
import { getMockAgentData, createdAgentToAgentData } from "@/lib/agent-data";
import { generateMockValidations } from "@/lib/mock-data";
import { useCreatedAgentsStore } from "@/stores/created-agents-store";
import { truncateAddress } from "@/lib/utils";

function VerifierContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("agentId") || "1";
  const [inputId, setInputId] = useState(initialId);
  const [checkedId, setCheckedId] = useState<number>(
    Math.max(1, Number.parseInt(initialId, 10) || 1)
  );

  const createdAgents = useCreatedAgentsStore((s) => s.agents);

  const verifiedAgent = useMemo(() => {
    const custom = createdAgents.find((a) => Number(a.agentId) === Number(checkedId));
    if (custom) {
      return createdAgentToAgentData(custom);
    }
    return getMockAgentData(11155111, checkedId);
  }, [checkedId, createdAgents]);

  const validations = useMemo(
    () => generateMockValidations(checkedId),
    [checkedId]
  );

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number.parseInt(inputId.replace(/\D/g, ""), 10);
    if (Number.isFinite(parsed) && parsed >= 1) {
      setCheckedId(parsed);
    }
  };

  return (
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
              <BadgeCheck className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              ERC-8004 Agent Verification
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Inspect on-chain registration, EIP-712 domain parameters, and KYA validator attestations for any agent ID.
          </p>
        </div>

        <Link href="/kya">
          <Button variant="outline" size="sm">
            Learn about KYA
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Verify Agent by ID</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleVerify} className="flex flex-wrap gap-2">
            <Input
              placeholder="Enter Agent ID (e.g. 1, 2, 51)"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              className="max-w-xs font-mono"
            />
            <Button type="submit" className="gap-1.5">
              <Search className="h-4 w-4" />
              Verify Agent
            </Button>
            {[1, 2, 3, ...createdAgents.map((a) => a.agentId)].slice(0, 5).map((id) => (
              <Button
                key={id}
                type="button"
                variant={checkedId === id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => {
                  setInputId(String(id));
                  setCheckedId(id);
                }}
                className="font-mono text-xs"
              >
                #{id}
              </Button>
            ))}
          </form>
        </CardContent>
      </Card>

      <Card className="border-accent-green/30">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent-green" />
              <CardTitle className="text-lg">
                {verifiedAgent.metadata.name} (#{verifiedAgent.agentId})
              </CardTitle>
              <Badge className="bg-accent-green/20 text-accent-green border-accent-green/40">
                Registration Valid
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Chain: {verifiedAgent.chainName} ({verifiedAgent.chainId}) · Registry:{" "}
              <code className="font-mono">{truncateAddress(verifiedAgent.registry)}</code>
            </p>
          </div>

          <Link href={`/agent/${verifiedAgent.agentId}`}>
            <Button size="sm" className="gap-1.5">
              Open Agent Profile
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-muted/30 p-4">
              <div className="text-xs text-muted-foreground">ERC-8004 Schema</div>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-accent-green">
                <CheckCircle2 className="h-4 w-4" />
                registration-v1
              </div>
            </div>
            <div className="rounded-lg bg-muted/30 p-4">
              <div className="text-xs text-muted-foreground">Owner Wallet</div>
              <div className="mt-1 font-mono text-sm font-semibold">
                {truncateAddress(verifiedAgent.owner)}
              </div>
            </div>
            <div className="rounded-lg bg-muted/30 p-4">
              <div className="text-xs text-muted-foreground">Configured Endpoints</div>
              <div className="mt-1 text-sm font-semibold">
                {(verifiedAgent.metadata.services ?? []).length} Active Services
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" />
              Validator Attestations ({validations.length})
            </h3>
            <div className="space-y-2">
              {validations.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/20 px-4 py-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                    <span className="font-medium text-foreground">{v.mechanism}</span>
                    <span className="text-muted-foreground font-mono">
                      Validator {truncateAddress(v.validatorAddress)}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-mono text-muted-foreground">
                    Tx: {truncateAddress(v.txHash)}
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
      <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading verifier...</div>}>
        <VerifierContent />
      </Suspense>
    </main>
  );
}
