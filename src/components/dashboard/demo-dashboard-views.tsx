"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeftRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Brain,
  CalendarClock,
  Check,
  Code2,
  Coins,
  Copy,
  Cpu,
  CreditCard,
  ExternalLink,
  Fingerprint,
  IdCard,
  Layers,
  MessageSquare,
  Pencil,
  Plug,
  Plus,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  Terminal,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useDemoDashboard } from "@/components/dashboard/demo-dashboard-shell";
import { AgentAvatar } from "@/components/shared/agent-avatar";
import { VerifiedTick } from "@/components/shared/verified-badge";
import { RegisteredTick } from "@/components/shared/registered-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toast-simple";
import { agentPublicPath } from "@/lib/agent-public-url";
import { getChainByChainId } from "@/lib/chains";
import { SOLANA_CHAIN_ID } from "@/lib/chain-constants";
import { saveCustomDemoAgentToStorage, type DemoSeedAgent } from "@/lib/demo-store";
import type { DashboardWorkspaceSection } from "@/lib/dashboard/navigation";

function CopyInlineButton({
  text,
  label = "Address",
}: {
  readonly text: string;
  readonly label?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          showToast(`${label} copied`, "success");
          setTimeout(() => setCopied(false), 1800);
        } catch {
          showToast("Could not copy", "error");
        }
      }}
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
      title={`Copy ${label}`}
    >
      <span>
        {text.slice(0, 6)}…{text.slice(-4)}
      </span>
      {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
    </button>
  );
}

export function DemoAgentOverview({
  agent: propAgent,
}: {
  readonly agent?: DemoSeedAgent;
}) {
  const { activeAgent, refreshAgents } = useDemoDashboard();
  const agent = propAgent ?? activeAgent;
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(agent.name);
  const [editDesc, setEditDesc] = useState(agent.description);
  const [editWebsite, setEditWebsite] = useState(agent.socials.website ?? "");
  const [editTwitter, setEditTwitter] = useState(agent.socials.twitter ?? "");

  const publicProfileHref = agentPublicPath({
    chainId: agent.chainId,
    agentId: agent.agentId,
    name: agent.name,
  });
  const chainConfig = getChainByChainId(agent.chainId);
  const chainLabel =
    chainConfig?.name ?? (agent.chainId === SOLANA_CHAIN_ID ? "Solana" : `Chain ${agent.chainId}`);
  const tok = agent.token;

  const handleSaveEdit = () => {
    const updated: DemoSeedAgent = {
      ...agent,
      name: editName.trim() || agent.name,
      description: editDesc.trim() || agent.description,
      socials: {
        ...agent.socials,
        website: editWebsite.trim() || null,
        twitter: editTwitter.trim() || null,
      },
    };
    saveCustomDemoAgentToStorage(updated);
    refreshAgents();
    showToast("Agent profile updated", "success");
    setEditOpen(false);
  };

  return (
    <div className="ui-overview">
      {/* Header */}
      <div className="ui-overview-header">
        <AgentAvatar
          image={agent.image}
          name={agent.name}
          size="lg"
          className="!size-14 rounded-2xl shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-bold tracking-tight text-foreground">
              {agent.name}
            </h1>
            {agent.isVerified ? <VerifiedTick size="md" /> : null}
            {agent.chainId === SOLANA_CHAIN_ID || agent.sapVerified ? (
              <RegisteredTick size="md" />
            ) : null}
            <span className="rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              AR-CRED-{agent.agentId}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-muted-foreground">
            {agent.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setEditName(agent.name);
              setEditDesc(agent.description);
              setEditWebsite(agent.socials.website ?? "");
              setEditTwitter(agent.socials.twitter ?? "");
              setEditOpen(true);
            }}
          >
            <Pencil className="mr-1.5 size-3.5" />
            Edit profile
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={publicProfileHref}>
              Public profile
              <ArrowUpRight className="ml-1 size-3.5" />
            </Link>
          </Button>
          {tok ? (
            <Button size="sm" asChild>
              <Link href={`/tokens/${tok.mint}`}>
                <Coins className="mr-1.5 size-3.5" />
                View ${tok.symbol}
              </Link>
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link href={`/dashboard/agents/${agent.id}/launchpad`}>
                <Coins className="mr-1.5 size-3.5" />
                Launch token
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Top 4 Metrics */}
      <div className="ui-overview-metrics">
        <div className="ui-overview-metric">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            AR Trust Score
          </p>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
              {agent.score.toFixed(1)}
            </span>
            <span className="text-xs font-medium text-emerald-400">Top 1% Indexed</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
            <div
              className="h-full rounded-full bg-foreground"
              style={{ width: `${Math.min(100, agent.score)}%` }}
            />
          </div>
        </div>

        <div className="ui-overview-metric">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Linked Token Market
          </p>
          {tok ? (
            <>
              <div className="mt-1.5 flex items-baseline justify-between">
                <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
                  ${(tok.marketCapUsd / 1_000_000).toFixed(2)}M
                </span>
                <span
                  className={
                    tok.priceChange24hPct >= 0
                      ? "font-mono text-xs font-medium text-emerald-400"
                      : "font-mono text-xs font-medium text-red-400"
                  }
                >
                  {tok.priceChange24hPct >= 0 ? "+" : ""}
                  {tok.priceChange24hPct.toFixed(1)}%
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                ${tok.symbol} · ${tok.priceUsd} · Vol ${(tok.volume24hUsd / 1_000).toFixed(0)}K
              </p>
            </>
          ) : (
            <>
              <p className="mt-1.5 text-lg font-semibold text-muted-foreground">Not launched</p>
              <Link
                href={`/dashboard/agents/${agent.id}/launchpad`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-foreground underline"
              >
                Launch on Metaplex / Pump.fun →
              </Link>
            </>
          )}
        </div>

        <div className="ui-overview-metric">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Creator Fee Revenue (90%)
          </p>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
              2.21 SOL
            </span>
            <span className="font-mono text-xs text-emerald-400">$424.30 earned</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Auto-settled to agent wallet · 10% to $AR flywheel
          </p>
        </div>

        <div className="ui-overview-metric">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            MCP &amp; x402 Telemetry
          </p>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tabular-nums text-emerald-400">
              99.94%
            </span>
            <span className="font-mono text-xs text-muted-foreground">42ms p95</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {agent.services.length} active endpoint{agent.services.length === 1 ? "" : "s"} · x402{" "}
            {agent.x402Support ? "Enabled" : "Off"}
          </p>
        </div>
      </div>

      {/* 2-Column Sections Grid */}
      <div className="ui-overview-grid">
        {/* Agent Details */}
        <section className="ui-overview-section">
          <h2>Agent Identity &amp; Custody</h2>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">Status</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400" />
              Active &amp; Indexed
            </span>
          </div>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">Primary Registry</span>
            <span className="font-medium">
              {chainLabel} ({agent.chainId === SOLANA_CHAIN_ID ? "SAP / MPL-Core" : "ERC-8004"})
            </span>
          </div>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">Agent ID</span>
            <span className="font-mono">#{agent.agentId}</span>
          </div>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">Solana Custody Wallet</span>
            <CopyInlineButton text={agent.agentWallet} label="Solana wallet" />
          </div>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">EVM Owner Address</span>
            <CopyInlineButton text={agent.owner} label="EVM owner" />
          </div>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">Operator Credential</span>
            <Link
              href="/dashboard/credentials"
              className="font-mono text-xs text-foreground underline"
            >
              AR-CRED-{agent.agentId} ({agent.verificationTier})
            </Link>
          </div>
        </section>

        {/* Token & Launchpad */}
        <section className="ui-overview-section">
          <h2>Token &amp; Creator Economics</h2>
          {tok ? (
            <>
              <div className="ui-overview-row">
                <span className="text-muted-foreground">Token</span>
                <Link
                  href={`/tokens/${tok.mint}`}
                  className="font-semibold text-foreground underline"
                >
                  {tok.name} (${tok.symbol})
                </Link>
              </div>
              <div className="ui-overview-row">
                <span className="text-muted-foreground">Launch Venue</span>
                <span>{tok.venue} · Mainnet</span>
              </div>
              <div className="ui-overview-row">
                <span className="text-muted-foreground">Mint Address</span>
                <CopyInlineButton text={tok.mint} label="Token mint" />
              </div>
              <div className="ui-overview-row">
                <span className="text-muted-foreground">24h Transactions</span>
                <span className="font-mono text-xs">
                  <span className="text-emerald-400">{tok.buys24h} buys</span> ·{" "}
                  <span className="text-red-400">{tok.sells24h} sells</span>
                </span>
              </div>
              <div className="ui-overview-row">
                <span className="text-muted-foreground">Fee Split</span>
                <span>90% Creator · 10% $AR Buyback Flywheel</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/agents/${agent.id}/launchpad`}>
                    Manage Launchpad &amp; Fees
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/tokens/${tok.mint}`}>
                    Public Token Page <ArrowUpRight className="ml-1 size-3.5" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3 py-2">
              <p className="text-sm text-muted-foreground">
                Bind an official token to {agent.name} via Metaplex Genesis or Pump.fun and earn 90%
                of creator trading fees automatically.
              </p>
              <Button size="sm" asChild>
                <Link href={`/dashboard/agents/${agent.id}/launchpad`}>
                  <Coins className="mr-1.5 size-3.5" />
                  Open Token Launchpad
                </Link>
              </Button>
            </div>
          )}
        </section>

        {/* Services & MCP */}
        <section className="ui-overview-section">
          <h2>MCP &amp; A2A Service Endpoints</h2>
          {agent.services.map((srv) => (
            <div key={srv.endpoint} className="ui-overview-row">
              <span className="font-mono text-xs font-semibold uppercase text-foreground">
                {srv.name} ({srv.version})
              </span>
              <span className="max-w-[240px] truncate font-mono text-xs text-muted-foreground">
                {srv.endpoint}
              </span>
            </div>
          ))}
          <div className="ui-overview-row">
            <span className="text-muted-foreground">Capabilities</span>
            <span className="text-right text-xs">{agent.capabilities.slice(0, 3).join(" · ")}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/agents/${agent.id}/services`}>Configure Endpoints</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/agents/${agent.id}/chat`}>Test in Agent Chat</Link>
            </Button>
          </div>
        </section>

        {/* Quick Actions & Activity */}
        <section className="ui-overview-section">
          <h2>Recent Workspace Activity</h2>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">ERC-8004 Manifest</span>
            <span className="text-xs text-emerald-400">Anchored &amp; Verified</span>
          </div>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">GitHub Dev Proof</span>
            <span className="text-xs">
              {agent.socials.github ? "Connected · Push verified" : "Ready to connect"}
            </span>
          </div>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">x402 Micropayments</span>
            <span className="text-xs text-emerald-400">0.01 USDC / call active</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/agents/${agent.id}/register`}>On-Chain Register</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/agents/${agent.id}/analytics`}>View Analytics</Link>
            </Button>
          </div>
        </section>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Agent Profile</DialogTitle>
            <DialogDescription>
              Changes update both your creator dashboard and the public directory immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Agent Name</label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <Textarea
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Website</label>
                <Input value={editWebsite} onChange={(e) => setEditWebsite(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">X / Twitter</label>
                <Input value={editTwitter} onChange={(e) => setEditTwitter(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEdit}>
                Save Profile
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function resolveSectionFromPathname(pathname: string): DashboardWorkspaceSection {
  if (pathname.endsWith("/chat")) return "chat";
  if (pathname.endsWith("/launchpad")) return "launchpad";
  if (pathname.endsWith("/schedule")) return "schedule";
  if (pathname.endsWith("/wallet")) return "wallet";
  if (pathname.endsWith("/register")) return "register";
  if (pathname.endsWith("/trade/terminal") || pathname.endsWith("/trade")) return "trade-terminal";
  if (pathname.endsWith("/trade/swap")) return "trade-swap";
  if (pathname.endsWith("/trade/perps")) return "trade-perps";
  if (pathname.endsWith("/trade/copy")) return "trade-copy";
  if (pathname.endsWith("/memory")) return "memory";
  if (pathname.endsWith("/inference")) return "inference";
  if (pathname.endsWith("/x402-market")) return "x402-market";
  if (pathname.endsWith("/services")) return "services";
  if (pathname.endsWith("/connections")) return "connections";
  if (pathname.endsWith("/github")) return "github";
  if (pathname.endsWith("/monetize")) return "monetize";
  if (pathname.endsWith("/analytics")) return "analytics";
  if (pathname.endsWith("/rankings")) return "rankings";
  if (pathname.endsWith("/health")) return "health";
  if (pathname.endsWith("/social")) return "social";
  if (pathname.endsWith("/verify")) return "verify";
  if (pathname.endsWith("/credentials")) return "credentials";
  if (pathname.endsWith("/card")) return "card";
  if (pathname.endsWith("/referrals")) return "referrals";
  if (pathname.endsWith("/settings")) return "settings";
  return "overview";
}

export function DemoSectionView({
  section,
}: {
  readonly section?: DashboardWorkspaceSection;
}) {
  const { activeAgent, creditsUsd, addCreditsUsd, isDeveloper, setIsDeveloper } =
    useDemoDashboard();
  const resolvedSection: DashboardWorkspaceSection =
    section ??
    (typeof window !== "undefined"
      ? resolveSectionFromPathname(window.location.pathname)
      : "overview");

  // Interactive states for sections
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "agent"; text: string; time: string }>
  >([
    {
      role: "agent",
      text: `Hello! I am ${activeAgent.name}. My MCP server (${activeAgent.services[0]?.endpoint ?? "https://mcp.agentranking.io"}) and ERC-8004 identity (#${activeAgent.agentId}) are online. How can I assist your desk today?`,
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("claude-3-7-sonnet");
  const [claimedSol, setClaimedSol] = useState(false);
  const [newMemory, setNewMemory] = useState("");
  const [memories, setMemories] = useState([
    "Operator preference: prioritize Base & Solana USDC pools with >$500k TVL.",
    "Risk guardrail: max slippage 45 bps on Jupiter v6 and Uniswap v4 routes.",
    "x402 settlement wallet verified: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU.",
  ]);
  const [schedules, setSchedules] = useState([
    {
      id: "job-1",
      name: "Cross-Exchange Perp Funding Scan",
      cron: "*/15 * * * *",
      active: true,
      lastRun: "4 mins ago",
    },
    {
      id: "job-2",
      name: "KOL & GitHub Mindshare Digest",
      cron: "0 */4 * * *",
      active: true,
      lastRun: "2 hours ago",
    },
    {
      id: "job-3",
      name: "Automated Creator Fee Claim & Rebalance",
      cron: "0 0 * * *",
      active: false,
      lastRun: "Yesterday",
    },
  ]);

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = chatInput.trim();
    if (!prompt) return;
    setChatInput("");
    const userMsg = { role: "user" as const, text: prompt, time: "Just now" };
    const reply = {
      role: "agent" as const,
      text: `[${selectedModel}] Executed MCP tool call across ${activeAgent.capabilities.slice(0, 2).join(" & ")}. Signal confidence: 94.2%. On-chain attestation logged for ${activeAgent.name} (#${activeAgent.agentId}).`,
      time: "Just now",
    };
    setChatMessages((prev) => [...prev, userMsg, reply]);
  };

  if (resolvedSection === "overview") {
    return <DemoAgentOverview agent={activeAgent} />;
  }

  if (resolvedSection === "chat") {
    return (
      <div className="ui-overview space-y-4">
        <div className="ui-overview-header">
          <MessageSquare className="size-6 text-foreground" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold">Agent Chat &amp; MCP Playground — {activeAgent.name}</h1>
            <p className="text-xs text-muted-foreground">
              Test prompts, inspect tool calls, and verify real-time responses against your agent persona.
            </p>
          </div>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground"
          >
            <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
            <option value="gpt-4.1">GPT-4.1</option>
            <option value="deepseek-r1">DeepSeek R1</option>
            <option value="llama-3.3-70b">Llama 3.3 70B</option>
          </select>
        </div>

        <div className="ui-overview-section flex min-h-[420px] flex-col justify-between">
          <div className="space-y-3 overflow-y-auto pr-1">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.role === "user"
                    ? "ml-auto max-w-xl rounded-2xl bg-foreground px-4 py-2.5 text-sm text-background"
                    : "max-w-xl rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-foreground"
                }
              >
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={sendChatMessage} className="mt-4 flex gap-2 border-t border-border/60 pt-3">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Ask ${activeAgent.name} to scan markets, run an MCP tool, or simulate a trade…`}
              className="flex-1"
            />
            <Button type="submit">
              <Send className="mr-1.5 size-3.5" />
              Send
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (resolvedSection === "launchpad") {
    const tok = activeAgent.token;
    return (
      <div className="ui-overview space-y-4">
        <div className="ui-overview-header">
          <Coins className="size-6 text-foreground" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold">Token Launchpad &amp; Creator Fees — {activeAgent.name}</h1>
            <p className="text-xs text-muted-foreground">
              Launch an official agent token on Solana (Metaplex Genesis or Pump.fun) with 90% creator fee sharing.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/launch">Open Public Quick-Launch →</Link>
          </Button>
        </div>

        <div className="ui-overview-grid">
          <section className="ui-overview-section">
            <h2>Bound Agent Token</h2>
            {tok ? (
              <>
                <div className="ui-overview-row">
                  <span className="text-muted-foreground">Token Name &amp; Ticker</span>
                  <span className="font-semibold">
                    {tok.name} (${tok.symbol})
                  </span>
                </div>
                <div className="ui-overview-row">
                  <span className="text-muted-foreground">Launch Protocol</span>
                  <span>{tok.venue} · Solana Mainnet</span>
                </div>
                <div className="ui-overview-row">
                  <span className="text-muted-foreground">Mint Address</span>
                  <CopyInlineButton text={tok.mint} label="Token mint" />
                </div>
                <div className="ui-overview-row">
                  <span className="text-muted-foreground">Market Cap / 24h Volume</span>
                  <span className="font-mono">
                    ${(tok.marketCapUsd / 1_000_000).toFixed(2)}M · $
                    {(tok.volume24hUsd / 1_000).toFixed(0)}K
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" asChild>
                    <Link href={`/tokens/${tok.mint}`}>
                      View Live Token Page <ArrowUpRight className="ml-1 size-3.5" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3 py-2">
                <p className="text-sm text-muted-foreground">
                  No token bound yet. Launch a token directly from the public launchpad or bind an existing mint.
                </p>
                <Button size="sm" asChild>
                  <Link href="/launch">Launch Token Now</Link>
                </Button>
              </div>
            )}
          </section>

          <section className="ui-overview-section">
            <h2>Creator Fee Vault (90% / 10% Split)</h2>
            <div className="ui-overview-row">
              <span className="text-muted-foreground">Total Distributed</span>
              <span className="font-mono font-semibold">2.45 SOL ($470.40)</span>
            </div>
            <div className="ui-overview-row">
              <span className="text-muted-foreground">Creator Share (90%)</span>
              <span className="font-mono text-emerald-400">2.205 SOL</span>
            </div>
            <div className="ui-overview-row">
              <span className="text-muted-foreground">Claimable Now</span>
              <span className="font-mono font-semibold">
                {claimedSol ? "0.000 SOL" : "0.640 SOL ($122.88)"}
              </span>
            </div>
            <div className="mt-3">
              <Button
                size="sm"
                disabled={claimedSol}
                onClick={() => {
                  setClaimedSol(true);
                  showToast("0.640 SOL creator fees claimed to agent wallet!", "success");
                }}
              >
                {claimedSol ? "All Fees Claimed ✓" : "Claim 0.640 SOL to Wallet"}
              </Button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (resolvedSection === "schedule") {
    return (
      <div className="ui-overview space-y-4">
        <div className="ui-overview-header">
          <CalendarClock className="size-6 text-foreground" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold">Autonomous Schedule &amp; Cron Jobs — {activeAgent.name}</h1>
            <p className="text-xs text-muted-foreground">
              Configure recurring market scans, social broadcasts, and portfolio rebalances.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              const id = `job-${schedules.length + 1}`;
              setSchedules((prev) => [
                ...prev,
                {
                  id,
                  name: "Hourly x402 Endpoint Health & Liquidity Check",
                  cron: "0 * * * *",
                  active: true,
                  lastRun: "Scheduled",
                },
              ]);
              showToast("New scheduled task added", "success");
            }}
          >
            <Plus className="mr-1.5 size-3.5" />
            Add Cron Task
          </Button>
        </div>

        <div className="ui-overview-section space-y-2">
          {schedules.map((job) => (
            <div key={job.id} className="ui-overview-row">
              <div>
                <p className="font-medium text-foreground">{job.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  cron: {job.cron} · Last run: {job.lastRun}
                </p>
              </div>
              <Button
                variant={job.active ? "secondary" : "outline"}
                size="sm"
                onClick={() => {
                  setSchedules((prev) =>
                    prev.map((j) => (j.id === job.id ? { ...j, active: !j.active } : j)),
                  );
                  showToast(
                    `${job.name} ${job.active ? "paused" : "activated"}`,
                    "info",
                  );
                }}
              >
                {job.active ? "Active ✓" : "Paused"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (resolvedSection === "memory") {
    return (
      <div className="ui-overview space-y-4">
        <div className="ui-overview-header">
          <Brain className="size-6 text-foreground" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold">Episodic &amp; Vector Memory — {activeAgent.name}</h1>
            <p className="text-xs text-muted-foreground">
              Inspect and pin persistent context facts shared across Chat, Scheduled Runs, and MCP tools.
            </p>
          </div>
        </div>

        <div className="ui-overview-section space-y-3">
          <div className="flex gap-2">
            <Input
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
              placeholder="Add a persistent memory rule or guardrail for this agent…"
            />
            <Button
              onClick={() => {
                if (!newMemory.trim()) return;
                setMemories((prev) => [newMemory.trim(), ...prev]);
                setNewMemory("");
                showToast("Memory vector indexed", "success");
              }}
            >
              Pin Memory
            </Button>
          </div>
          {memories.map((m, idx) => (
            <div key={idx} className="ui-overview-row">
              <span className="text-sm">{m}</span>
              <span className="font-mono text-xs text-emerald-400">Pinned</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Generic rich interactive view for remaining sections (Wallet, Register, Trade, Inference, Services, GitHub, Monetize, Analytics, Rankings, Health, Verify, Credentials, Card, Settings)
  return (
    <div className="ui-overview space-y-4">
      <div className="ui-overview-header">
        <Sparkles className="size-6 text-foreground" />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold capitalize">
            {resolvedSection.replace("-", " ")} — {activeAgent.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            Live workspace module for {activeAgent.name} (#{activeAgent.agentId}) · Operator Credential AR-CRED-{activeAgent.agentId}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/agents/${activeAgent.id}`}>Back to Overview</Link>
        </Button>
      </div>

      <div className="ui-overview-grid">
        <section className="ui-overview-section">
          <h2>Module Telemetry &amp; Configuration</h2>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">Active Agent</span>
            <span className="font-semibold">{activeAgent.name}</span>
          </div>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">Solana Custody Wallet</span>
            <CopyInlineButton text={activeAgent.agentWallet} label="Solana wallet" />
          </div>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">EVM ERC-8004 Owner</span>
            <CopyInlineButton text={activeAgent.owner} label="EVM owner" />
          </div>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">LLM Inference Credits</span>
            <span className="font-mono font-semibold">${creditsUsd.toFixed(2)} USD</span>
          </div>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">Developer Preview Access</span>
            <button
              type="button"
              onClick={() => {
                setIsDeveloper(!isDeveloper);
                showToast(
                  `Developer preview ${!isDeveloper ? "enabled" : "disabled"}`,
                  "info",
                );
              }}
              className="font-mono text-xs text-emerald-400 underline"
            >
              {isDeveloper ? "Enabled (All sections unlocked)" : "Disabled"}
            </button>
          </div>
        </section>

        <section className="ui-overview-section">
          <h2>Quick Actions</h2>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">On-Chain ERC-8004 Manifest</span>
            <span className="font-mono text-xs text-emerald-400">
              ipfs://bafkreidemo{activeAgent.agentId}
            </span>
          </div>
          <div className="ui-overview-row">
            <span className="text-muted-foreground">Primary MCP Endpoint</span>
            <span className="truncate font-mono text-xs text-muted-foreground">
              {activeAgent.services[0]?.endpoint ?? "https://mcp.agentranking.io"}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => {
                showToast(`Synced ${resolvedSection} state for ${activeAgent.name}`, "success");
              }}
            >
              Sync On-Chain State
            </Button>
            <Button variant="outline" size="sm" onClick={() => addCreditsUsd(25)}>
              +$25 LLM Credits
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link
                href={agentPublicPath({
                  chainId: activeAgent.chainId,
                  agentId: activeAgent.agentId,
                  name: activeAgent.name,
                })}
              >
                View Public Dossier <ArrowUpRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
