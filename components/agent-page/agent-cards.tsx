"use client";

import {
  BarChart3,
  MessageSquare,
  Star,
  Bot,
  Check,
  Shield,
  Link2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getExplorerUrl, getTokenExplorerUrl } from "@/lib/chains";
import { truncateAddress, timeAgo } from "@/lib/utils";
import type { AgentData } from "@/lib/agent-data";
import { getDeterministicAgentMetrics, generateMockValidations } from "@/lib/mock-data";
import { useCreatedAgentsStore } from "@/stores/created-agents-store";

const CARD_PADDING = "1.25rem 1.5rem";

const MOCK_FEEDBACK = [
  {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8b123",
    comment: "Solid agent, used it for MCP integration. Works great.",
  },
  {
    address: "0x8f3a21Bc7744E0532925a3b844Bc9e7595f8bc456",
    comment: "Quick response times. Would recommend.",
  },
  {
    address: "0x1a2b3c4d5e6f7890a1b2c3d4e5f678901234d789",
    comment: "Helped me automate my workflow. Five stars.",
  },
];

const ICON_BTN_CLASS = "h-9 w-9 shrink-0 [&_svg]:size-4";
const ICON_BTN_SM_CLASS = "h-7 w-7 shrink-0 [&_svg]:size-3";
const ICON_BTN_XS_CLASS = "h-6 w-6 shrink-0 [&_svg]:size-2.5";
const ICON_BTN_MINIMAL_CLASS = "h-4 w-4 shrink-0 p-0 min-w-0 border-0 bg-transparent hover:bg-transparent text-muted-foreground hover:text-foreground [&_svg]:size-2.5";

function CopyBtn({ value, size = "default", minimal = false }: { value: string; size?: "default" | "sm"; minimal?: boolean }) {
  const btnClass = minimal ? ICON_BTN_MINIMAL_CLASS : (size === "sm" ? ICON_BTN_SM_CLASS : ICON_BTN_CLASS);
  const iconSize = minimal ? "h-2.5 w-2.5" : (size === "sm" ? "h-3 w-3" : "h-4 w-4");
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={minimal ? "ghost" : "secondary"}
          size="icon"
          className={btnClass}
          onClick={() => navigator.clipboard?.writeText(value)}
        >
          <Copy className={iconSize} />
          <span className="sr-only">Copy</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Copy</TooltipContent>
    </Tooltip>
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
      className="inline-flex items-center gap-0.5 text-[11px] text-primary hover:underline"
    >
      {children}
      <ExternalLink className="h-2.5 w-2.5" />
    </a>
  );
}

const VALUE_HIGHLIGHT_CLASS = "rounded-md bg-muted/60 px-2 py-1 text-[11px]";

function MetadataRow({
  label,
  value,
  copyValue,
  externalHref,
  mono = false,
  wideValue = false,
}: {
  label: string;
  value: React.ReactNode;
  copyValue?: string;
  externalHref?: string;
  mono?: boolean;
  wideValue?: boolean;
}) {
  return (
    <div
      className={
        wideValue
          ? "grid grid-cols-[minmax(0,40%)_minmax(0,60%)] gap-4 text-sm items-start"
          : "flex justify-between items-start gap-4 text-sm"
      }
    >
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
        <span className={`min-w-0 text-right ${VALUE_HIGHLIGHT_CLASS} ${mono ? "font-mono break-all" : ""}`}>
          {value}
        </span>
        {copyValue && <CopyBtn value={copyValue} size="sm" />}
        {externalHref && (
          <a href={externalHref} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className={ICON_BTN_SM_CLASS}>
              <ExternalLink className="h-3 w-3" />
              <span className="sr-only">Open</span>
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}

function StatusPill({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={
        active
          ? "rounded-md bg-accent-green/20 px-2 py-0.5 text-xs text-accent-green"
          : "rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
      }
    >
      {children}
    </span>
  );
}

const METADATA_PILL_CLASS = "rounded-md bg-muted px-2 py-0.5 text-xs";

const READONLY_BOX_CLASS = "flex min-w-0 flex-1 items-center gap-2 rounded-md border border-input px-3 py-2 text-xs";
const READONLY_BOX_BG = "bg-muted/70";
const CONTRACT_STATE_VALUE_CLASS = "font-mono text-xs";

function ReadOnlyField({
  label,
  value,
  copyValue,
  externalHref,
  mono = false,
  breakAll = false,
}: {
  label: string;
  value: React.ReactNode;
  copyValue?: string;
  externalHref?: string;
  mono?: boolean;
  breakAll?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className={`${READONLY_BOX_CLASS} ${READONLY_BOX_BG} items-center`}>
        <span className={`min-w-0 flex-1 ${mono ? "font-mono" : ""} ${breakAll ? "break-all" : "truncate"} ${CONTRACT_STATE_VALUE_CLASS}`} title={typeof copyValue === "string" ? copyValue : undefined}>
          {value}
        </span>
        <div className="flex shrink-0 items-center gap-0.5">
          {copyValue && <CopyBtn value={copyValue} minimal />}
          {externalHref && (
            <a href={externalHref} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className={ICON_BTN_MINIMAL_CLASS}>
                <ExternalLink className="h-3 w-3" />
                <span className="sr-only">Open</span>
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function StatisticsCard({ agent }: { agent: AgentData }) {
  const statsPadding = "1.5rem 1.75rem";
  const createdAgents = useCreatedAgentsStore((s) => s.agents);
  const userFeedback = useCreatedAgentsStore((s) => s.feedbackByAgent[agent.agentId] ?? []);
  const isCustom = createdAgents.some((a) => Number(a.agentId) === Number(agent.agentId));
  const metrics = getDeterministicAgentMetrics(agent.agentId);

  const stars = isCustom ? "4.9" : metrics.stars;
  const reputation = isCustom ? 94.2 : metrics.reputation;
  const feedbackCount = (isCustom ? 12 : metrics.feedbackCount) + userFeedback.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2" style={{ padding: statsPadding, paddingBottom: "0.75rem" }}>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
        <CardTitle className="text-sm font-medium text-muted-foreground">Statistics Overview</CardTitle>
      </CardHeader>
      <CardContent style={{ padding: statsPadding, paddingTop: "1.5rem" }}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-lg bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-current text-accent-green" />
              Average Score
            </div>
            <div className="mt-2 text-lg font-bold text-accent-green">{stars}/5.0</div>
            <div className="text-xs text-muted-foreground">({reputation}/100)</div>
          </div>
          <div className="rounded-lg bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" />
              Total Feedback
            </div>
            <div className="mt-2 text-lg font-bold">{feedbackCount}</div>
          </div>
          <div className="rounded-lg bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5" />
              Overall Score
            </div>
            <div className="mt-2 text-lg font-bold text-accent-green">{reputation}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContractStateCard({ agent }: { agent: AgentData }) {
  const { agentId, chainId, chainName, registry, owner, agentWallet } = agent;
  return (
    <Card className="min-h-[160px]">
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
            <CopyBtn value={String(agentId)} />
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
            <CopyBtn value={owner} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Registry</span>
          <div className="flex items-center gap-1">
            <ExplorerLink chainId={chainId} address={registry}>
              {truncateAddress(registry)}
            </ExplorerLink>
            <CopyBtn value={registry} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Agent Wallet</span>
          <div className="flex items-center gap-1">
            <ExplorerLink chainId={chainId} address={agentWallet}>
              X402 {truncateAddress(agentWallet)}
            </ExplorerLink>
            <CopyBtn value={agentWallet} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FeedbackCard() {
  const feedback = MOCK_FEEDBACK;
  return (
    <Card className="min-h-[100px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2" style={{ padding: CARD_PADDING, paddingBottom: "0.5rem" }}>
        <CardTitle className="text-sm font-medium text-muted-foreground">Feedback</CardTitle>
        <Button variant="secondary" size="sm">
          View all ({feedback.length})
        </Button>
      </CardHeader>
      <CardContent style={{ padding: CARD_PADDING, paddingTop: "0.5rem" }}>
        {feedback.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No feedback yet. Connect wallet to leave feedback.
          </p>
        ) : (
          <div className="space-y-0">
            {feedback.map((item, i) => (
              <div
                key={item.address}
                className={i < feedback.length - 1 ? "border-b border-border/60 pb-3 mb-3" : ""}
              >
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {truncateAddress(item.address)}
                  </span>
                  <p className="text-sm text-foreground">{item.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ContractStateEndpointsCard({ agent }: { agent: AgentData }) {
  const { agentId, chainId, chainName, registry, owner, agentWallet } = agent;
  const services = agent.metadata.services ?? agent.metadata.endpoints ?? [];

  return (
    <Card className="flex min-h-[320px] flex-col">
      <div className="flex-1 space-y-3" style={{ padding: CARD_PADDING }}>
        <TooltipProvider delayDuration={300}>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
              Contract State
            </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={getExplorerUrl(chainId, "address", registry)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" size="icon" className={ICON_BTN_SM_CLASS}>
                      <ExternalLink className="h-3 w-3" />
                      <span className="sr-only">View Contract</span>
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="bottom">View Contract</TooltipContent>
              </Tooltip>
          </div>
          <CardContent className="space-y-4 p-0">
            <ReadOnlyField label="Agent ID" value={agentId} copyValue={String(agentId)} />
            <ReadOnlyField label="Chain" value={chainName} />
            <ReadOnlyField
              label="Owner Address"
              value={owner}
              copyValue={owner}
              externalHref={getExplorerUrl(chainId, "address", owner)}
              mono
              breakAll
            />
            <ReadOnlyField
              label="Identity Contract"
              value={registry}
              copyValue={registry}
              externalHref={getExplorerUrl(chainId, "address", registry)}
              mono
              breakAll
            />
            <ReadOnlyField
              label="EIP-712 Domain"
              value={(() => {
                const domain = JSON.stringify(
                  {
                    name: "ERC-8004",
                    version: "1",
                    chainId,
                    verifyingContract: registry,
                  },
                  null,
                  2
                );
                return domain;
              })()}
              copyValue={JSON.stringify({
                name: "ERC-8004",
                version: "1",
                chainId,
                verifyingContract: registry,
              })}
              externalHref={getExplorerUrl(chainId, "address", registry)}
              mono
              breakAll
            />
          </CardContent>
        </div>

        <div className="border-t border-border pt-4">
          <div className="mb-3 flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Bot className="h-3.5 w-3.5 text-muted-foreground" />
              Agent Endpoints
            </CardTitle>
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">
              {services.length} configured
            </span>
          </div>
          <div className="space-y-3">
            {services.length === 0 ? (
              <p className="text-xs text-muted-foreground">No endpoints configured.</p>
            ) : (
              services.map((svc, i) => (
                <div key={svc.endpoint ?? i}>
                  <div className={`${READONLY_BOX_CLASS} ${READONLY_BOX_BG} items-start`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-xs">{svc.name ?? "Unknown"}</span>
                        {svc.version && (
                          <span className="rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">v{svc.version}</span>
                        )}
                      </div>
                      {svc.endpoint && (
                        <code className="mt-0.5 block truncate text-xs text-muted-foreground" title={svc.endpoint}>
                          {svc.endpoint}
                        </code>
                      )}
                    </div>
                    {svc.endpoint && (
                      <div className="flex shrink-0 items-center gap-0.5">
                        <CopyBtn value={svc.endpoint} minimal />
                        {svc.endpoint.startsWith("http") && (
                          <a href={svc.endpoint} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className={ICON_BTN_MINIMAL_CLASS}>
                              <ExternalLink className="h-3 w-3" />
                              <span className="sr-only">Open</span>
                            </Button>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        </TooltipProvider>
      </div>
    </Card>
  );
}

export function EndpointsCard({ agent }: { agent: AgentData }) {
  const services = agent.metadata.services ?? agent.metadata.endpoints ?? [];
  return (
    <Card className="min-h-[200px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">Agent Endpoints</CardTitle>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
          {services.length} configured
        </span>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <p className="mb-4 text-sm text-muted-foreground">
          Agent communication services.
        </p>
        {services.length === 0 ? (
          <p className="text-sm text-muted-foreground">No endpoints configured.</p>
        ) : (
          <div className="space-y-2">
            {services.map((svc, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{svc.name ?? "Unknown"}</span>
                    {svc.version && (
                      <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {svc.version}
                      </span>
                    )}
                  </div>
                  {svc.endpoint && (
                    <code className="mt-1 block truncate text-xs text-muted-foreground">
                      {svc.endpoint}
                    </code>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  {svc.endpoint && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() =>
                          navigator.clipboard?.writeText(svc.endpoint!)
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      {svc.endpoint.startsWith("http") && (
                        <a href={svc.endpoint} target="_blank" rel="noopener noreferrer">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function OnChainMetadataCard({ agent }: { agent: AgentData }) {
  const { chainId, registry } = agent;
  const { metadata } = agent;
  const agentRegistryCaip = `eip155:${chainId}:${registry}`;
  return (
    <Card className="min-h-[160px]">
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
                <span key={t} className="rounded bg-muted px-2 py-0.5 text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function OffChainMetadataCard({ agent }: { agent: AgentData }) {
  const { agentURI, metadata } = agent;
  return (
    <Card className="min-h-[180px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Off-Chain Metadata
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-6 pt-4 text-sm">
        <div>
          <span className="text-muted-foreground">Agent URI</span>
          <div className="flex items-center gap-1">
            <code className="flex-1 truncate text-xs">{agentURI.slice(0, 30)}...</code>
            {agentURI.startsWith("http") && (
              <a href={agentURI} target="_blank" rel="noopener noreferrer">
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
  );
}

export function CapabilitiesCard({ agent }: { agent: AgentData }) {
  const services = agent.metadata.services ?? agent.metadata.endpoints ?? [];
  const capabilities: string[] = [];
  for (const s of services) {
    if (s.name?.toLowerCase() === "mcp") {
      const raw = s as {
        mcpTools?: string[];
        mcpPrompts?: string[];
        mcpResources?: string[];
      };
      if (raw.mcpTools?.length) capabilities.push("tools");
      if (raw.mcpPrompts?.length) capabilities.push("prompts");
      if (raw.mcpResources?.length) capabilities.push("resources");
    }
  }
  const capSet = new Set(capabilities);
  if (capSet.size === 0) capSet.add("tools").add("resources").add("prompts");

  return (
    <Card className="min-h-[160px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Capabilities</CardTitle>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
          {capSet.size}
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {Array.from(capSet).map((cap) => (
            <span
              key={cap}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
            >
              <Check className="h-3 w-3 text-primary" />
              {cap}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TagsCard({ agent }: { agent: AgentData }) {
  const tags = agent.metadata.tags ?? [];
  return (
    <Card className="min-h-[110px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Tags</CardTitle>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
          {tags.length}
        </span>
      </CardHeader>
      <CardContent>
        {tags.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tags assigned</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TimestampsCard({ agent }: { agent: AgentData }) {
  const createdAt = agent.createdAt
    ? new Date(agent.createdAt * 1000).toLocaleString()
    : "—";
  const updatedAt = agent.metadata.updatedAt
    ? new Date(agent.metadata.updatedAt * 1000).toLocaleString()
    : createdAt;
  return (
    <Card className="min-h-[140px]">
      <CardHeader className="pb-2" style={{ padding: CARD_PADDING, paddingBottom: "0.5rem" }}>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Timestamps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm" style={{ padding: CARD_PADDING, paddingTop: "0.5rem" }}>
        <div>
          <span className="text-muted-foreground">Created</span>
          <div>{createdAt}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Last Updated</span>
          <div>{updatedAt}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OnChainOffChainCard({ agent }: { agent: AgentData }) {
  const { agentId, chainId, registry, agentURI } = agent;
  const { metadata } = agent;
  const tokenExplorerHref = getTokenExplorerUrl(chainId, registry, agentId);
  const agentUriExternal = agentURI.startsWith("http") ? agentURI : undefined;

  return (
    <Card className="min-h-[140px]">
      <CardContent style={{ padding: CARD_PADDING }}>
        <div className="flex flex-col gap-6">
          {/* On-Chain Metadata */}
          <div className="space-y-3" style={{ paddingBottom: "1rem" }}>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              On-Chain Metadata
            </CardTitle>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center gap-4 text-sm">
                <span className="shrink-0 text-muted-foreground">Agent NFT</span>
                <a
                  href={tokenExplorerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-0.5 text-primary hover:underline ${VALUE_HIGHLIGHT_CLASS}`}
                >
                  View on Explorer
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
              <div className="flex justify-between items-center gap-4 text-sm">
                <span className="shrink-0 text-muted-foreground">Active</span>
                <span className={`${VALUE_HIGHLIGHT_CLASS} font-mono`}>
                  {metadata.active ? "true" : "false"}
                </span>
              </div>
              {metadata.updatedAt != null && (
                <MetadataRow
                  label="Updated At"
                  value={String(metadata.updatedAt)}
                  copyValue={String(metadata.updatedAt)}
                  mono
                />
              )}
              <div className="flex justify-between items-center gap-4 text-sm">
                <span className="shrink-0 text-muted-foreground">X402 Support</span>
                <span className={`${VALUE_HIGHLIGHT_CLASS} font-mono`}>
                  {metadata.x402Support ? "true" : "false"}
                </span>
              </div>
              {metadata.supportedTrust && metadata.supportedTrust.length > 0 && (
                <div className="flex justify-between items-start gap-4 text-sm">
                  <span className="shrink-0 text-muted-foreground">Supported Trust</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {metadata.supportedTrust.map((t) => (
                      <span key={t} className={METADATA_PILL_CLASS}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className="border-t-2"
            style={{ marginTop: "1rem", marginBottom: "1rem", borderColor: "hsla(0,0%,100%,0.12)" }}
          />

          {/* Off-Chain Metadata */}
          <div className="space-y-3" style={{ paddingBottom: "1rem" }}>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Off-Chain Metadata
            </CardTitle>
            <div className="space-y-3 text-sm">
              <MetadataRow
                label="Agent URI"
                value={agentURI}
                copyValue={agentURI}
                externalHref={agentUriExternal}
                mono
                wideValue
              />
              {metadata.tags && metadata.tags.length > 0 && (
                <div className="flex justify-between items-start gap-4 text-sm">
                  <span className="shrink-0 text-muted-foreground">Tags</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {metadata.tags.map((t) => (
                      <span key={t} className={METADATA_PILL_CLASS}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CapabilitiesTagsCard({ agent }: { agent: AgentData }) {
  const services = agent.metadata.services ?? agent.metadata.endpoints ?? [];
  const tags = agent.metadata.tags ?? [];

  const capabilities: string[] = [];
  for (const s of services) {
    if (s.name?.toLowerCase() === "mcp") {
      const raw = s as {
        mcpTools?: string[];
        mcpPrompts?: string[];
        mcpResources?: string[];
      };
      if (raw.mcpTools?.length) capabilities.push("tools");
      if (raw.mcpPrompts?.length) capabilities.push("prompts");
      if (raw.mcpResources?.length) capabilities.push("resources");
    }
  }
  const capSet = new Set(capabilities);
  if (capSet.size === 0) capSet.add("tools").add("resources").add("prompts");

  return (
    <Card className="min-h-[150px]">
      <CardContent style={{ padding: CARD_PADDING }}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <CardTitle className="mb-2 text-sm font-medium text-muted-foreground">
              Capabilities
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {Array.from(capSet).map((cap) => (
                <span
                  key={cap}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs"
                >
                  <Check className="h-3 w-3 text-primary" />
                  {cap}
                </span>
              ))}
            </div>
          </div>
          <div>
            <CardTitle className="mb-2 text-sm font-medium text-muted-foreground">
              Tags
            </CardTitle>
            {tags.length === 0 ? (
              <p className="text-xs text-muted-foreground">No tags assigned</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentValidationsCard({ agent }: { agent: AgentData }) {
  const validations = generateMockValidations(agent.agentId);
  return (
    <Card className="min-h-[180px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2" style={{ padding: CARD_PADDING, paddingBottom: "0.5rem" }}>
        <CardTitle className="text-sm font-medium text-muted-foreground">Recent Validations</CardTitle>
        <span className="rounded-full bg-accent-green/20 text-accent-green px-2 py-0.5 text-xs">
          {validations.length}
        </span>
      </CardHeader>
      <CardContent style={{ padding: CARD_PADDING, paddingTop: "0.5rem" }}>
        <div className="space-y-2.5">
          {validations.map((val) => (
            <div
              key={val.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-accent-green" />
                <span className="font-medium text-foreground">{val.mechanism}</span>
                <span className="text-muted-foreground font-mono">
                  by {truncateAddress(val.validatorAddress)}
                </span>
              </div>
              <span className="text-muted-foreground">{timeAgo(val.timestamp)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
