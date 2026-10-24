"use client";

import { Link2, Copy, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getExplorerUrl } from "@/lib/chains";
import { truncateAddress } from "@/lib/utils";
import type { AgentData } from "@/lib/agent-data";

function CopyButton({ value }: { value: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={() => navigator.clipboard?.writeText(value)}
    >
      <Copy className="h-3 w-3" />
      <span className="sr-only">Copy</span>
    </Button>
  );
}

function ExplorerLink({
  chainId,
  address,
  children,
}: {
  chainId: number;
  address: string;
  children: React.ReactNode;
}) {
  const href = getExplorerUrl(chainId, "address", address);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:underline"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

export function AgentSidebar({ agent }: { agent: AgentData }) {
  const {
    agentId,
    chainId,
    chainName,
    registry,
    owner,
    agentWallet,
    agentURI,
    metadata,
  } = agent;

  const agentRegistryCaip = `eip155:${chainId}:${registry}`;

  const updatedAt = metadata.updatedAt
    ? new Date(metadata.updatedAt * 1000).toLocaleString()
    : "—";

  return (
    <div className="sticky top-20 self-start space-y-6 min-[900px]:top-4">
      {/* Contract State */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            <Link2 className="h-4 w-4" />
            Contract State
          </CardTitle>
          <a
            href={getExplorerUrl(chainId, "address", registry)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            View Contract
          </a>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Agent ID</span>
            <div className="flex items-center gap-1">
              <span>{agentId}</span>
              <CopyButton value={String(agentId)} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Chain</span>
            <span>{chainName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Owner</span>
            <div className="flex items-center gap-1">
              <ExplorerLink chainId={chainId} address={owner}>
                {truncateAddress(owner)}
              </ExplorerLink>
              <CopyButton value={owner} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Creator</span>
            <div className="flex items-center gap-1">
              <ExplorerLink chainId={chainId} address={owner}>
                {truncateAddress(owner)}
              </ExplorerLink>
              <CopyButton value={owner} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Registry</span>
            <div className="flex items-center gap-1">
              <ExplorerLink chainId={chainId} address={registry}>
                {truncateAddress(registry)}
              </ExplorerLink>
              <CopyButton value={registry} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Agent Wallet</span>
            <div className="flex items-center gap-1">
              <ExplorerLink chainId={chainId} address={agentWallet}>
                X402 {truncateAddress(agentWallet)}
              </ExplorerLink>
              <CopyButton value={agentWallet} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* On-Chain Metadata */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            On-Chain Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Agent Registry</span>
            <div className="truncate font-mono text-xs">{agentRegistryCaip}</div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Active</span>
            <span>{metadata.active ? "true" : "false"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">X402 Support</span>
            <span>{metadata.x402Support ? "true" : "false"}</span>
          </div>
          {metadata.supportedTrust && metadata.supportedTrust.length > 0 && (
            <div>
              <span className="text-muted-foreground">Supported Trust</span>
              <div className="flex flex-wrap gap-1 pt-1">
                {metadata.supportedTrust.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-muted px-2 py-0.5 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Off-Chain Metadata */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Off-Chain Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Agent URI</span>
            <div className="flex items-center gap-1">
              <code className="flex-1 truncate text-xs">
                {agentURI.slice(0, 30)}...
              </code>
              {agentURI.startsWith("http") && (
                <a
                  href={agentURI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Name</span>
            <div>{metadata.name ?? "—"}</div>
          </div>
          {metadata.tags && metadata.tags.length > 0 && (
            <div>
              <span className="text-muted-foreground">Tags</span>
              <div className="flex flex-wrap gap-1 pt-1">
                {metadata.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-border px-2 py-0.5 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timestamps */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Timestamps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Created</span>
            <div>—</div>
          </div>
          <div>
            <span className="text-muted-foreground">Last Updated</span>
            <div>{updatedAt}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
