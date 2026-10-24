"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Brain,
  CalendarClock,
  Check,
  Coins,
  Copy,
  Cpu,
  ExternalLink,
  Fingerprint,
  IdCard,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Sparkles,
  Wallet,
} from "lucide-react";
import { RuntimeImage } from "@/components/shared/runtime-image";
import { useDemoDashboard } from "@/components/dashboard/demo-dashboard-shell";
import {
  EvmWalletFundsChart,
  SolanaWalletFundsChart,
  type WalletChartTransfer,
} from "@/components/dashboard/wallet-funds-chart";
import { AgentAvatar } from "@/components/shared/agent-avatar";
import { VerifiedTick } from "@/components/shared/verified-badge";
import { RegisteredTick } from "@/components/shared/registered-badge";
import { EthereumIcon } from "@/components/shared/ethereum-icon";
import { RobinhoodChainIcon } from "@/components/shared/robinhood-chain-icon";
import { Badge } from "@/components/ui/badge";
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
import { SOLANA_CHAIN_ID } from "@/lib/chain-constants";
import { cn } from "@/lib/utils";
import { saveCustomDemoAgentToStorage, type DemoSeedAgent } from "@/lib/demo-store";
import type { DashboardWorkspaceSection } from "@/lib/dashboard/navigation";

function shortenAddr(value: string, chars = 4): string {
  if (value.length <= chars * 2 + 1) return value;
  return `${value.slice(0, chars)}…${value.slice(-chars)}`;
}

/* ── Summary pill (one metric column) — exact match to 8004webapp/src/components/dashboard/dashboard-summary.tsx ── */
function SummaryPill({
  label,
  value,
  hint,
  href,
  className,
}: Readonly<{
  label: string;
  value: string;
  hint?: string;
  href?: string;
  className?: string;
}>) {
  const inner = (
    <div className="ui-overview-metric-content min-w-0 space-y-0.5">
      <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
        {label}
      </p>
      <p className="truncate text-sm font-semibold tabular-nums leading-tight sm:text-[15px]">
        {value}
      </p>
      {hint ? (
        <p
          className={cn(
            "truncate text-[11px] leading-snug",
            href ? "text-primary/80" : "text-muted-foreground",
          )}
          title={hint}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "ui-overview-metric flex min-w-0 flex-col justify-center px-3 py-2.5 sm:px-4 sm:py-3",
          className,
        )}
      >
        {inner}
      </Link>
    );
  }
  return (
    <div
      className={cn(
        "ui-overview-metric flex min-w-0 flex-col justify-center px-3 py-2.5 sm:px-4 sm:py-3",
        className,
      )}
    >
      {inner}
    </div>
  );
}

/* ── Quick action card — exact match to 8004webapp/src/components/dashboard/dashboard-summary.tsx ── */
function QuickActionCard({
  href,
  icon: Icon,
  label,
}: Readonly<{
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}>) {
  return (
    <Link
      href={href}
      className="ui-action-card ui-overview-quick-action group"
    >
      <Icon className="text-muted-foreground h-4 w-4 shrink-0 group-hover:text-foreground transition-colors" aria-hidden />
      <span className="text-sm font-medium">{label}</span>
      <div className="ml-auto text-muted-foreground/40 text-sm transition-colors group-hover:text-muted-foreground">
        →
      </div>
    </Link>
  );
}

/* ── Empty state panel ── */
function EmptyStatePanel({ title, description }: Readonly<{ title: string; description: string }>) {
  return (
    <div className="rounded-lg border border-border/30 px-4 py-3">
      <p className="text-muted-foreground/70 text-xs font-medium">{title}</p>
      <p className="text-muted-foreground/40 mt-1 text-[11px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

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
      <span>{shortenAddr(text, 5)}</span>
      {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
    </button>
  );
}

export function DemoAgentOverview({
  agent: propAgent,
}: {
  readonly agent?: DemoSeedAgent;
}) {
  const { activeAgent, refreshAgents, creditsUsd, openCreditsDialog } = useDemoDashboard();
  const agent = propAgent ?? activeAgent;
  const base = `/dashboard/agents/${agent.id}`;

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(agent.name);
  const [editDesc, setEditDesc] = useState(agent.description);
  const [editWebsite, setEditWebsite] = useState(agent.socials.website ?? "");
  const [editTwitter, setEditTwitter] = useState(agent.socials.twitter ?? "");

  const [solCopied, setSolCopied] = useState(false);
  const [evmCopied, setEvmCopied] = useState(false);
  const [solSyncing, setSolSyncing] = useState(false);
  const [evmSyncing, setEvmSyncing] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sendToAddress, setSendToAddress] = useState("");
  const [sendAmountSol, setSendAmountSol] = useState("0.25");

  const publicProfileHref = agentPublicPath({
    chainId: agent.chainId,
    agentId: agent.agentId,
    name: agent.name,
  });
  const isVerified = agent.isVerified;
  const isSolanaRegistered =
    agent.chainId === SOLANA_CHAIN_ID || agent.sapVerified;
  const tok = agent.token;
  const hasToken = Boolean(tok);
  const tokenPageHref = tok ? `/tokens/${tok.mint}` : `${base}/launchpad`;

  const demoTransfers: WalletChartTransfer[] = [
    {
      token: "SOL",
      fromPublicKey: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
      toPublicKey: agent.agentWallet,
      amountLamports: "1450000000",
      status: "confirmed",
      createdAt: new Date(Date.now() - 86_400_000 * 4).toISOString(),
      confirmedAt: new Date(Date.now() - 86_400_000 * 4).toISOString(),
    },
    {
      token: "SOL",
      fromPublicKey: agent.agentWallet,
      toPublicKey: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
      amountLamports: "320000000",
      status: "confirmed",
      createdAt: new Date(Date.now() - 86_400_000 * 2).toISOString(),
      confirmedAt: new Date(Date.now() - 86_400_000 * 2).toISOString(),
    },
    {
      token: "SOL",
      fromPublicKey: "MetaplexFeeVault11111111111111111111111111",
      toPublicKey: agent.agentWallet,
      amountLamports: "840000000",
      status: "confirmed",
      createdAt: new Date(Date.now() - 86_400_000 * 1).toISOString(),
      confirmedAt: new Date(Date.now() - 86_400_000 * 1).toISOString(),
    },
  ];

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
    <div className="ui-dashboard-overview mx-auto w-full max-w-5xl space-y-4 px-4 py-6 sm:px-6 min-w-0">
      {/* ──────────── Top unified summary strip ──────────────── */}
      <div className="ui-overview-summary overflow-hidden rounded-xl">
        {/* Identity */}
        <div className="ui-overview-identity flex min-w-0 items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5">
          <div className="shrink-0">
            <AgentAvatar image={agent.image} name={agent.name} size="lg" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex min-w-0 items-center gap-1.5">
              <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
                {agent.name}
              </h1>
              {isVerified ? <VerifiedTick size="md" /> : null}
              {isSolanaRegistered ? <RegisteredTick size="md" /> : null}
            </div>
            {agent.description ? (
              <p
                className="text-muted-foreground mt-0.5 truncate text-xs leading-relaxed"
                title={agent.description}
              >
                {agent.description}
              </p>
            ) : null}
            <p className="text-muted-foreground mt-0.5 font-mono text-[11px]">
              {shortenAddr(agent.agentWallet, 5)}
              <span className="text-muted-foreground/50"> · </span>
              <Link
                href="/dashboard/credentials"
                className="hover:text-foreground"
                title="Account credential"
              >
                AR-CRED-{agent.agentId}
              </Link>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <Link
              href={publicProfileHref}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[#212121] hover:text-foreground"
              aria-label="View public agent page"
              title="View public page"
            >
              <ExternalLink className="size-4" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => {
                setEditName(agent.name);
                setEditDesc(agent.description);
                setEditWebsite(agent.socials.website ?? "");
                setEditTwitter(agent.socials.twitter ?? "");
                setEditOpen(true);
              }}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[#212121] hover:text-foreground"
              aria-label="Edit agent profile"
              title="Edit profile"
            >
              <Pencil className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        {/* Metrics — divided board; 2×2 on slim, 1×4 when wider */}
        <div className="ui-overview-metrics grid grid-cols-2 sm:grid-cols-4">
          <SummaryPill
            className="border-b border-r border-border/60 sm:border-b-0"
            label="Wallet"
            value="$1,428.50"
            hint="4.82 SOL · 500 USDC · 12.5k AR"
          />
          <SummaryPill
            className="border-b border-border/60 sm:border-b-0 sm:border-r"
            label="LLM"
            value={`$${creditsUsd.toFixed(2)}`}
            hint="Credits"
          />
          <SummaryPill
            className="border-r border-border/60"
            label="Status"
            value={isVerified ? "Verified" : "Unverified"}
            hint={isVerified ? "Premium" : "Verify"}
            href={isVerified ? undefined : "/dashboard/verify"}
          />
          <SummaryPill
            label="Token"
            value={hasToken && tok ? `$${tok.symbol}` : "None"}
            hint={hasToken ? "Manage" : "Launch"}
            href={tokenPageHref}
          />
        </div>
      </div>

      {/* ──────────── Quick actions ──────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard href={`${base}/chat`} icon={MessageSquare} label="Chat" />
        <QuickActionCard href={`${base}/memory`} icon={Brain} label="Memory" />
        <QuickActionCard href={tokenPageHref} icon={Coins} label="Token" />
        <QuickActionCard href={`${base}/wallet`} icon={Wallet} label="Wallet" />
        <QuickActionCard href={`${base}/register`} icon={Fingerprint} label="Register" />
        <QuickActionCard href={`${base}/inference`} icon={Cpu} label="Inference" />
        <QuickActionCard href="/dashboard/verify" icon={BadgeCheck} label="Verification" />
        <QuickActionCard href="/dashboard/credentials" icon={IdCard} label="Credentials" />
        <QuickActionCard href={`${base}/analytics`} icon={BarChart3} label="Analytics" />
        <QuickActionCard href="/dashboard/settings" icon={Settings} label="Settings" />
      </div>

      {/* ──────────── Detail sections ───────────────────────── */}
      <div className="grid gap-4 min-w-0">
        <div className="space-y-4 min-w-0">
          {/* Agent Wallet Panel */}
          <div className="ui-overview-panel rounded-xl p-0">
            <div className="ui-overview-panel-header flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="text-muted-foreground h-4 w-4 shrink-0" aria-hidden />
                <h2 className="text-sm font-semibold">Agent wallet</h2>
              </div>
              <dl className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:gap-4">
                <div className="flex items-center gap-1">
                  <dt className="flex items-center gap-0.5 text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
                    <RuntimeImage src="/branding/solana/solanaLogoMark.svg" alt="" className="h-2.5 w-2.5 shrink-0 opacity-60" aria-hidden />
                    SOL
                  </dt>
                  <dd className="tabular-nums font-semibold">4.82</dd>
                </div>
                <div className="flex items-center gap-1">
                  <dt className="flex items-center gap-0.5 text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
                    <RuntimeImage src="/chain-assets/usdc.webp" alt="" className="h-2.5 w-2.5 shrink-0 opacity-60" aria-hidden />
                    USDC
                  </dt>
                  <dd className="tabular-nums font-semibold">500</dd>
                </div>
                <div className="flex items-center gap-1">
                  <dt className="flex items-center gap-0.5 text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
                    <EthereumIcon className="h-2.5 w-2.5 shrink-0 opacity-60" />
                    ETH
                  </dt>
                  <dd className="tabular-nums font-semibold">0.42</dd>
                </div>
                <div className="flex items-center gap-1">
                  <dt className="flex items-center gap-0.5 text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
                    <RobinhoodChainIcon className="h-2.5 w-2.5" />
                    RH
                  </dt>
                  <dd className="tabular-nums font-semibold">0.15</dd>
                </div>
                <div className="flex items-center gap-1">
                  <dt className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">USD</dt>
                  <dd className="tabular-nums font-semibold">$1,428.50</dd>
                </div>
              </dl>
            </div>

            <div className="px-5 py-4 space-y-5">
              {/* Solana section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <RuntimeImage src="/branding/solana/solanaLogoMark.svg" alt="" className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                    Solana wallet
                  </p>
                  <Badge variant="outline" className="font-normal text-xs">Generated</Badge>
                </div>

                <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-2.5 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="min-w-0 truncate font-mono text-xs text-foreground/90">
                      {agent.agentWallet}
                    </p>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                      onClick={() => {
                        void navigator.clipboard.writeText(agent.agentWallet);
                        setSolCopied(true);
                        showToast("Address copied to clipboard");
                        setTimeout(() => setSolCopied(false), 1500);
                      }}
                      aria-label="Copy wallet address"
                    >
                      {solCopied ? (
                        <span className="text-[10px] font-medium text-emerald-400">✓</span>
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={solSyncing}
                    onClick={() => {
                      setSolSyncing(true);
                      setTimeout(() => {
                        setSolSyncing(false);
                        showToast("Solana balance refreshed", "success");
                      }, 400);
                    }}
                  >
                    <RefreshCw className={cn("h-3.5 w-3.5", solSyncing && "animate-spin")} aria-hidden />
                    Refresh
                  </Button>
                  <Button size="sm" variant="secondary" asChild>
                    <a
                      href={`https://solscan.io/account/${agent.agentWallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      Solscan
                    </a>
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setSendModalOpen(true)}>
                    <Send className="h-3.5 w-3.5" aria-hidden />
                    Send
                  </Button>
                </div>

                <div className="mt-3">
                  <SolanaWalletFundsChart
                    agentDbId={agent.id}
                    walletPublicKey={agent.agentWallet}
                    currentUsd={1428.5}
                    solPrice={192.6}
                    initialTransfers={demoTransfers}
                  />
                </div>

                <div className="mt-3 space-y-2">
                  {demoTransfers.map((tx, idx) => {
                    const isOutbound = tx.fromPublicKey === agent.agentWallet;
                    const amount = Number(tx.amountLamports) / 1_000_000_000;
                    return (
                      <div
                        key={idx}
                        className="flex flex-col rounded-lg border border-border/30 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1 text-xs">
                            <span className="font-medium">{isOutbound ? "Sent" : "Received"}</span>
                            <span className="tabular-nums font-mono text-foreground/90">
                              {amount.toFixed(4)} {tx.token}
                            </span>
                          </p>
                          <p className="text-muted-foreground mt-0.5 truncate font-mono text-[10px]">
                            {isOutbound
                              ? `To: ${shortenAddr(tx.toPublicKey)}`
                              : `From: ${shortenAddr(tx.fromPublicKey)}`}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end sm:gap-0.5">
                          <span className="text-[10px] font-medium text-green-400">Confirmed</span>
                          <span className="text-muted-foreground text-[10px]">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* EVM wallet divider */}
              <div className="border-t border-border/30" />

              {/* EVM section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <EthereumIcon className="h-4 w-4 shrink-0 opacity-90" />
                  <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                    EVM wallet
                  </p>
                  <Badge variant="outline" className="font-normal text-xs">Generated</Badge>
                </div>

                <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-2.5 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="min-w-0 truncate font-mono text-xs text-foreground/90">
                      {agent.owner}
                    </p>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                      onClick={() => {
                        void navigator.clipboard.writeText(agent.owner);
                        setEvmCopied(true);
                        showToast("Address copied");
                        setTimeout(() => setEvmCopied(false), 1500);
                      }}
                      aria-label="Copy EVM address"
                    >
                      {evmCopied ? (
                        <span className="text-[10px] font-medium text-emerald-400">✓</span>
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
                  <div className="rounded-lg border border-border/60 px-3 py-2">
                    <p className="text-muted-foreground text-[10px] uppercase flex items-center gap-1">
                      <EthereumIcon className="h-2.5 w-2.5" />
                      Ethereum
                    </p>
                    <p className="font-semibold tabular-nums">0.42 ETH</p>
                  </div>
                  <div className="rounded-lg border border-border/60 px-3 py-2">
                    <p className="text-muted-foreground text-[10px] uppercase flex items-center gap-1">
                      <RobinhoodChainIcon className="h-2.5 w-2.5" />
                      Robinhood Chain
                    </p>
                    <p className="font-semibold tabular-nums">0.15 ETH</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={evmSyncing}
                    onClick={() => {
                      setEvmSyncing(true);
                      setTimeout(() => {
                        setEvmSyncing(false);
                        showToast("EVM balances synced", "success");
                      }, 400);
                    }}
                  >
                    <RefreshCw className={cn("h-3.5 w-3.5", evmSyncing && "animate-spin")} aria-hidden />
                    Refresh
                  </Button>
                  <Button size="sm" variant="secondary" asChild>
                    <a
                      href={`https://etherscan.io/address/${agent.owner}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      Etherscan
                    </a>
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setSendModalOpen(true)}>
                    <Send className="h-3.5 w-3.5" aria-hidden />
                    Send
                  </Button>
                </div>

                <div className="mt-3">
                  <EvmWalletFundsChart currentUsd={1482} />
                </div>

                <p className="text-muted-foreground mt-2 text-[10px] leading-relaxed">
                  Secure embedded wallet infrastructure provided by Privy.
                </p>
              </div>
            </div>
          </div>

          {/* LLM Balance Panel */}
          <div className="ui-overview-panel rounded-xl p-0">
            <div className="ui-overview-panel-header flex items-center gap-2 px-5 py-4">
              <Bot className="text-muted-foreground h-4 w-4 shrink-0" aria-hidden />
              <h2 className="text-sm font-semibold">LLM Balance</h2>
            </div>
            <div className="space-y-4 px-5 py-4">
              <div>
                <p className="text-2xl font-semibold tabular-nums text-emerald-400">
                  ${creditsUsd.toFixed(2)}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Available for agent compute
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={openCreditsDialog}>
                  Add funds
                </Button>
              </div>
              <div className="space-y-1.5">
                <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                  Recent deposits
                </p>
                <ul className="max-h-36 divide-y divide-border/40 overflow-y-auto rounded-lg border border-border/50">
                  <li className="flex items-center gap-2 px-2.5 py-1.5 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-baseline gap-1.5">
                        <span className="shrink-0 font-medium">Settled</span>
                        <span className="truncate tabular-nums text-muted-foreground">$25.00</span>
                      </div>
                      <p className="text-muted-foreground truncate text-[10px] leading-tight">
                        Today · 5xK9m2pL…
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center gap-2 px-2.5 py-1.5 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-baseline gap-1.5">
                        <span className="shrink-0 font-medium">Settled</span>
                        <span className="truncate tabular-nums text-muted-foreground">$17.50</span>
                      </div>
                      <p className="text-muted-foreground truncate text-[10px] leading-tight">
                        3 days ago · 8rTy4vBn…
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Capabilities Panel */}
          <div className="ui-overview-panel rounded-xl p-0">
            <div className="ui-overview-panel-header flex items-center gap-2 px-5 py-4">
              <Settings className="text-muted-foreground h-4 w-4 shrink-0" aria-hidden />
              <h2 className="text-sm font-semibold">Capabilities</h2>
            </div>
            <div className="px-5 py-4">
              {agent.capabilities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border/60 bg-muted/10 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyStatePanel
                  title="No capabilities configured yet"
                  description="Capabilities will appear here as this agent is configured."
                />
              )}
            </div>
          </div>
        </div>
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

      {/* Send Transfer Modal */}
      <Dialog open={sendModalOpen} onOpenChange={setSendModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send from {agent.name} Wallet</DialogTitle>
            <DialogDescription>
              Simulate an outbound transfer from your custodial agent wallet ({shortenAddr(agent.agentWallet, 6)}).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Recipient Address</label>
              <Input
                value={sendToAddress}
                onChange={(e) => setSendToAddress(e.target.value)}
                placeholder="Solana or EVM recipient address"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Amount (SOL)</label>
              <Input
                value={sendAmountSol}
                onChange={(e) => setSendAmountSol(e.target.value)}
                placeholder="0.25"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSendModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  showToast(`Sent ${sendAmountSol || "0.25"} SOL from ${agent.name}`, "success");
                  setSendModalOpen(false);
                }}
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Confirm Send
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
      <div className="ui-dashboard-overview mx-auto w-full max-w-5xl space-y-4 px-4 py-6 sm:px-6 min-w-0">
        <div className="ui-overview-summary overflow-hidden rounded-xl">
          <div className="ui-overview-identity flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-3">
              <MessageSquare className="size-5 text-muted-foreground" />
              <div>
                <h1 className="text-base font-semibold sm:text-lg">
                  Agent Chat &amp; MCP Playground — {activeAgent.name}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Test prompts, inspect tool calls, and verify real-time responses against your agent persona.
                </p>
              </div>
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
        </div>

        <div className="ui-overview-panel flex min-h-[440px] flex-col justify-between rounded-xl p-5">
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
      <div className="ui-dashboard-overview mx-auto w-full max-w-5xl space-y-4 px-4 py-6 sm:px-6 min-w-0">
        <div className="ui-overview-summary overflow-hidden rounded-xl">
          <div className="ui-overview-identity flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-3">
              <Coins className="size-5 text-muted-foreground" />
              <div>
                <h1 className="text-base font-semibold sm:text-lg">
                  Token Launchpad &amp; Creator Fees — {activeAgent.name}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Launch an official agent token on Solana (Metaplex Genesis or Pump.fun) with 90% creator fee sharing.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/launch">Open Public Quick-Launch →</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="ui-overview-panel rounded-xl p-0">
            <div className="ui-overview-panel-header flex items-center gap-2 px-5 py-4">
              <Coins className="text-muted-foreground h-4 w-4 shrink-0" />
              <h2 className="text-sm font-semibold">Bound Agent Token</h2>
            </div>
            <div className="space-y-3 px-5 py-4 text-sm">
              {tok ? (
                <>
                  <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
                    <span className="text-muted-foreground">Token Name &amp; Ticker</span>
                    <span className="font-semibold">
                      {tok.name} (${tok.symbol})
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
                    <span className="text-muted-foreground">Launch Protocol</span>
                    <span>{tok.venue} · Solana Mainnet</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
                    <span className="text-muted-foreground">Mint Address</span>
                    <CopyInlineButton text={tok.mint} label="Token mint" />
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-muted-foreground">Market Cap / 24h Volume</span>
                    <span className="font-mono">
                      ${(tok.marketCapUsd / 1_000_000).toFixed(2)}M · $
                      {(tok.volume24hUsd / 1_000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="pt-2">
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
            </div>
          </div>

          <div className="ui-overview-panel rounded-xl p-0">
            <div className="ui-overview-panel-header flex items-center gap-2 px-5 py-4">
              <Wallet className="text-muted-foreground h-4 w-4 shrink-0" />
              <h2 className="text-sm font-semibold">Creator Fee Vault (90% / 10% Split)</h2>
            </div>
            <div className="space-y-3 px-5 py-4 text-sm">
              <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
                <span className="text-muted-foreground">Total Distributed</span>
                <span className="font-mono font-semibold">2.45 SOL ($470.40)</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
                <span className="text-muted-foreground">Creator Share (90%)</span>
                <span className="font-mono text-emerald-400">2.205 SOL</span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="text-muted-foreground">Claimable Now</span>
                <span className="font-mono font-semibold">
                  {claimedSol ? "0.000 SOL" : "0.640 SOL ($122.88)"}
                </span>
              </div>
              <div className="pt-2">
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (resolvedSection === "schedule") {
    return (
      <div className="ui-dashboard-overview mx-auto w-full max-w-5xl space-y-4 px-4 py-6 sm:px-6 min-w-0">
        <div className="ui-overview-summary overflow-hidden rounded-xl">
          <div className="ui-overview-identity flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-3">
              <CalendarClock className="size-5 text-muted-foreground" />
              <div>
                <h1 className="text-base font-semibold sm:text-lg">
                  Autonomous Schedule &amp; Cron Jobs — {activeAgent.name}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Configure recurring market scans, social broadcasts, and portfolio rebalances.
                </p>
              </div>
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
        </div>

        <div className="ui-overview-panel rounded-xl p-0">
          <div className="ui-overview-panel-header flex items-center gap-2 px-5 py-4">
            <CalendarClock className="text-muted-foreground h-4 w-4 shrink-0" />
            <h2 className="text-sm font-semibold">Scheduled Tasks</h2>
          </div>
          <div className="divide-y divide-border/40 px-5 py-2">
            {schedules.map((job) => (
              <div key={job.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{job.name}</p>
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
      </div>
    );
  }

  if (resolvedSection === "memory") {
    return (
      <div className="ui-dashboard-overview mx-auto w-full max-w-5xl space-y-4 px-4 py-6 sm:px-6 min-w-0">
        <div className="ui-overview-summary overflow-hidden rounded-xl">
          <div className="ui-overview-identity flex items-center gap-3 px-4 py-3.5 sm:px-5">
            <Brain className="size-5 text-muted-foreground" />
            <div>
              <h1 className="text-base font-semibold sm:text-lg">
                Episodic &amp; Vector Memory — {activeAgent.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                Inspect and pin persistent context facts shared across Chat, Scheduled Runs, and MCP tools.
              </p>
            </div>
          </div>
        </div>

        <div className="ui-overview-panel rounded-xl p-0">
          <div className="ui-overview-panel-header flex items-center gap-2 px-5 py-4">
            <Brain className="text-muted-foreground h-4 w-4 shrink-0" />
            <h2 className="text-sm font-semibold">Pinned Memory Vectors</h2>
          </div>
          <div className="space-y-3 px-5 py-4">
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
            <div className="divide-y divide-border/40 rounded-lg border border-border/50">
              {memories.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-sm">{m}</span>
                  <span className="font-mono text-xs text-emerald-400">Pinned</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ui-dashboard-overview mx-auto w-full max-w-5xl space-y-4 px-4 py-6 sm:px-6 min-w-0">
      <div className="ui-overview-summary overflow-hidden rounded-xl">
        <div className="ui-overview-identity flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-3">
            <Sparkles className="size-5 text-muted-foreground" />
            <div>
              <h1 className="text-base font-semibold capitalize sm:text-lg">
                {resolvedSection.replace("-", " ")} — {activeAgent.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                Live workspace module for {activeAgent.name} (#{activeAgent.agentId}) · Operator Credential AR-CRED-{activeAgent.agentId}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/agents/${activeAgent.id}`}>Back to Overview</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="ui-overview-panel rounded-xl p-0">
          <div className="ui-overview-panel-header flex items-center gap-2 px-5 py-4">
            <Settings className="text-muted-foreground h-4 w-4 shrink-0" />
            <h2 className="text-sm font-semibold">Module Telemetry &amp; Configuration</h2>
          </div>
          <div className="space-y-3 px-5 py-4 text-sm">
            <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
              <span className="text-muted-foreground">Active Agent</span>
              <span className="font-semibold">{activeAgent.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
              <span className="text-muted-foreground">Solana Custody Wallet</span>
              <CopyInlineButton text={activeAgent.agentWallet} label="Solana wallet" />
            </div>
            <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
              <span className="text-muted-foreground">EVM ERC-8004 Owner</span>
              <CopyInlineButton text={activeAgent.owner} label="EVM owner" />
            </div>
            <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
              <span className="text-muted-foreground">LLM Inference Credits</span>
              <span className="font-mono font-semibold">${creditsUsd.toFixed(2)} USD</span>
            </div>
            <div className="flex items-center justify-between">
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
          </div>
        </div>

        <div className="ui-overview-panel rounded-xl p-0">
          <div className="ui-overview-panel-header flex items-center gap-2 px-5 py-4">
            <Sparkles className="text-muted-foreground h-4 w-4 shrink-0" />
            <h2 className="text-sm font-semibold">Quick Actions</h2>
          </div>
          <div className="space-y-3 px-5 py-4 text-sm">
            <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
              <span className="text-muted-foreground">On-Chain ERC-8004 Manifest</span>
              <span className="font-mono text-xs text-emerald-400">
                ipfs://bafkreidemo{activeAgent.agentId}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
              <span className="text-muted-foreground">Primary MCP Endpoint</span>
              <span className="truncate font-mono text-xs text-muted-foreground max-w-[200px]">
                {activeAgent.services[0]?.endpoint ?? "https://mcp.agentranking.io"}
              </span>
            </div>
            <div className="pt-2 flex flex-wrap gap-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}
