"use client";

import Link from "next/link";
import { Shield, CheckCircle2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AgentData } from "@/lib/agent-data";
import { generateMockValidations } from "@/lib/mock-data";
import { getExplorerUrl } from "@/lib/chains";
import { truncateAddress, timeAgo } from "@/lib/utils";

export function ValidationSection({ agent }: { agent: AgentData }) {
  const validations = generateMockValidations(agent.agentId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-accent-green" />
              Validator Attestations &amp; Proofs
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Cryptographic and stake-backed attestations for {agent.metadata.name ?? `Agent #${agent.agentId}`}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent-green/20 text-accent-green px-2.5 py-0.5 text-xs font-medium">
              {validations.length} Active Proofs
            </span>
            <Link href={`/verification?agentId=${agent.agentId}`}>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Run Live Check
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {validations.map((val) => (
            <div
              key={val.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-muted/20 p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent-green" />
                  <span className="text-sm font-medium text-foreground">
                    {val.mechanism}
                  </span>
                  <Badge variant="outline" className="text-[11px] border-accent-green/40 text-accent-green">
                    {val.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  Validator:{" "}
                  <a
                    href={getExplorerUrl(agent.chainId, "address", val.validatorAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {truncateAddress(val.validatorAddress)}
                  </a>{" "}
                  · {timeAgo(val.timestamp)}
                </div>
              </div>
              <a
                href={getExplorerUrl(agent.chainId, "tx", val.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground"
              >
                Tx: {truncateAddress(val.txHash)}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
