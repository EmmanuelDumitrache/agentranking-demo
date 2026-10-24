"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Check,
  Coins,
  Copy,
  ExternalLink,
  HelpCircle,
  LogOut,
  Menu,
  Plus,
  Send,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { AgentAvatar } from "@/components/shared/agent-avatar";
import { VerifiedTick } from "@/components/shared/verified-badge";
import { RegisteredTick } from "@/components/shared/registered-badge";
import { AgentRankingWordmark } from "@/components/layout/agent-ranking-wordmark";
import { DashboardWorkspaceNav } from "@/components/dashboard/dashboard-workspace-nav";
import { DashboardDevBuildBadge } from "@/components/dashboard/dashboard-nav-preview-access";
import { DashboardMainWaveBackground } from "@/components/dashboard/main-wave-background";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { showToast } from "@/components/ui/toast-simple";
import { cn } from "@/lib/utils";
import {
  DEMO_SEED_AGENTS,
  readCustomDemoAgentsFromStorage,
  type DemoSeedAgent,
} from "@/lib/demo-store";
import {
  agentSwitchHref,
  parseDashboardAgentDbIdFromPath,
} from "@/lib/dashboard/navigation";
import { SOLANA_CHAIN_ID } from "@/lib/chain-constants";

const LAST_AGENT_STORAGE_KEY = "ar-dashboard-last-agent-id";

type DemoDashboardContextValue = {
  readonly ownedAgents: DemoSeedAgent[];
  readonly activeAgent: DemoSeedAgent;
  readonly activeAgentId: number;
  readonly selectAgent: (id: number) => void;
  readonly refreshAgents: () => void;
  readonly creditsUsd: number;
  readonly addCreditsUsd: (amount: number) => void;
  readonly isDeveloper: boolean;
  readonly setIsDeveloper: (val: boolean) => void;
};

const DemoDashboardContext = createContext<DemoDashboardContextValue | null>(null);

export function useDemoDashboard(): DemoDashboardContextValue {
  const ctx = useContext(DemoDashboardContext);
  if (!ctx) {
    throw new Error("useDemoDashboard must be used within DemoDashboardShell");
  }
  return ctx;
}

function getInitialOwnedAgents(): DemoSeedAgent[] {
  const defaultOwned = DEMO_SEED_AGENTS.filter((a) => [101, 102, 104].includes(a.id));
  const custom = readCustomDemoAgentsFromStorage();
  const seen = new Set<number>();
  const combined: DemoSeedAgent[] = [];
  for (const agent of [...custom, ...defaultOwned]) {
    if (seen.has(agent.id)) continue;
    seen.add(agent.id);
    combined.push(agent);
  }
  return combined;
}

export function DemoDashboardShell({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "/dashboard";
  const router = useRouter();
  const pathAgentId = parseDashboardAgentDbIdFromPath(pathname);

  const [ownedAgents, setOwnedAgents] = useState<DemoSeedAgent[]>(() =>
    getInitialOwnedAgents(),
  );
  const [storedAgentId, setStoredAgentId] = useState<number>(101);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [creditsUsd, setCreditsUsd] = useState<number>(42.5);
  const [isDeveloper, setIsDeveloper] = useState<boolean>(true);
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("Manny · Tokyo Operator");

  const refreshAgents = useCallback(() => {
    setOwnedAgents(getInitialOwnedAgents());
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("agentranking-app", "dark");
    document.documentElement.style.colorScheme = "dark";
    try {
      const savedId = window.localStorage.getItem(LAST_AGENT_STORAGE_KEY);
      if (savedId) {
        const parsed = Number.parseInt(savedId, 10);
        if (Number.isFinite(parsed) && parsed > 0) {
          setStoredAgentId(parsed);
        }
      }
      const savedSession = window.localStorage.getItem("agentranking_demo_session_v1");
      if (savedSession) {
        const parsed = JSON.parse(savedSession) as { displayName?: string };
        if (parsed.displayName) setDisplayName(parsed.displayName);
      }
    } catch {
      // Ignore storage errors
    }
    refreshAgents();
    const onDemoUpdated = () => refreshAgents();
    window.addEventListener("agentranking:demo-updated", onDemoUpdated);
    return () => {
      window.removeEventListener("agentranking:demo-updated", onDemoUpdated);
    };
  }, [refreshAgents]);

  useEffect(() => {
    if (pathAgentId != null) {
      setStoredAgentId(pathAgentId);
      try {
        window.localStorage.setItem(LAST_AGENT_STORAGE_KEY, String(pathAgentId));
      } catch {
        // Ignore storage errors
      }
    }
  }, [pathAgentId]);

  const activeAgentId = pathAgentId ?? storedAgentId ?? ownedAgents[0]?.id ?? 101;
  const activeAgent = useMemo(() => {
    return (
      ownedAgents.find((a) => a.id === activeAgentId) ??
      DEMO_SEED_AGENTS.find((a) => a.id === activeAgentId) ??
      ownedAgents[0] ??
      DEMO_SEED_AGENTS[0]!
    );
  }, [ownedAgents, activeAgentId]);

  const selectAgent = useCallback((id: number) => {
    setStoredAgentId(id);
    try {
      window.localStorage.setItem(LAST_AGENT_STORAGE_KEY, String(id));
    } catch {
      // Ignore
    }
  }, []);

  const addCreditsUsd = useCallback((amount: number) => {
    setCreditsUsd((prev) => Number((prev + amount).toFixed(2)));
    showToast(`Added $${amount.toFixed(2)} in LLM inference credits`, "success");
    setCreditsDialogOpen(false);
  }, []);

  const copyAddress = async (addr: string, label: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopiedAddr(addr);
      showToast(`${label} copied`, "success");
      setTimeout(() => setCopiedAddr(null), 1800);
    } catch {
      showToast("Could not copy address", "error");
    }
  };

  const handleLogout = () => {
    try {
      window.localStorage.removeItem("agentranking_demo_session_v1");
    } catch {
      // Ignore
    }
    showToast("Signed out of demo workspace", "info");
    router.push("/auth/login");
  };

  const maxAgents = 10;

  const contextValue = useMemo<DemoDashboardContextValue>(
    () => ({
      ownedAgents,
      activeAgent,
      activeAgentId: activeAgent.id,
      selectAgent,
      refreshAgents,
      creditsUsd,
      addCreditsUsd,
      isDeveloper,
      setIsDeveloper,
    }),
    [
      ownedAgents,
      activeAgent,
      selectAgent,
      refreshAgents,
      creditsUsd,
      addCreditsUsd,
      isDeveloper,
    ],
  );

  return (
    <DemoDashboardContext.Provider value={contextValue}>
      <div className="dark flex min-h-screen flex-col bg-background text-foreground md:flex-row">
        {/* Desktop Sidebar */}
        <aside className="ui-youtube-sidebar hidden w-56 shrink-0 flex-col md:flex">
          <div className="flex items-center justify-between gap-2 px-4 py-3.5">
            <Link href="/" className="shrink-0" title="Back to public site">
              <AgentRankingWordmark size="sidebar" />
            </Link>
            <DashboardDevBuildBadge />
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto px-3 py-2">
            {/* Owned Agents Switcher */}
            <div className="mb-3">
              <div className="mb-1.5 flex items-center justify-between gap-2 px-2.5">
                <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
                  Agents
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-[11px] tabular-nums">
                    {ownedAgents.length}/{maxAgents}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 shrink-0 rounded-md border-border/80"
                    aria-label="Create agent"
                    asChild
                  >
                    <Link href="/dashboard/agents/new">
                      <Plus className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </div>
              {ownedAgents.map((agent) => {
                const href = agentSwitchHref(pathname, agent.id);
                const selected = activeAgent.id === agent.id;
                const isSol = agent.chainId === SOLANA_CHAIN_ID || agent.sapVerified;
                return (
                  <Link
                    key={agent.id}
                    href={href}
                    onClick={() => {
                      selectAgent(agent.id);
                      if (!selected) {
                        showToast(`Switched to ${agent.name}`, "info");
                      }
                    }}
                    className={cn(
                      "ui-nav-link",
                      selected && "ui-nav-link--active",
                    )}
                  >
                    <AgentAvatar
                      image={agent.image}
                      name={agent.name}
                      size="sm"
                      className="shrink-0"
                    />
                    <span className="min-w-0 flex-1 truncate">{agent.name}</span>
                    <span className="flex shrink-0 items-center gap-1">
                      {agent.isVerified ? <VerifiedTick size="sm" /> : null}
                      {isSol ? <RegisteredTick size="sm" /> : null}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Workspace Navigation Tree */}
            <nav className="space-y-0.5 border-t border-border/60 pt-2" aria-label="Workspace">
              <DashboardWorkspaceNav
                activeAgentId={activeAgent.id}
                pathname={pathname}
                variant="desktop"
                isDeveloper={isDeveloper}
              />
            </nav>
          </div>

          <div className="flex flex-col items-center gap-1.5 border-t border-border/60 px-3 pb-1.5 pt-2">
            <Popover open={guideOpen} onOpenChange={setGuideOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Guide me
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" align="center" className="w-64 p-4">
                <p className="text-sm font-medium">Creator workspace</p>
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                  Create an agent, launch a token, earn creator fees. Fund your agent wallet,
                  verify identity, and track performance.
                </p>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1 border-t border-border/60 p-3">
            <div className="flex items-center justify-between px-2.5 py-1">
              <a
                href="https://x.com/agentranking"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span className="text-[13px] font-bold leading-none">𝕏</span>
              </a>
              <a
                href="https://t.me/agentranking"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Send className="h-3.5 w-3.5" />
              </a>
              <Link
                href="/docs"
                aria-label="Docs"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <BookOpen className="h-3.5 w-3.5" />
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="ui-nav-link w-full text-left"
              type="button"
            >
              <LogOut className="ui-nav-icon" aria-hidden />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen ? (
          <div
            className="ui-mobile-nav-drawer fixed inset-0 z-50 md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden
            />
            <div className="ui-mobile-nav-sheet fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,272px)] flex-col bg-card shadow-2xl">
              <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-3.5">
                <div className="flex min-w-0 items-center gap-2">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <AgentRankingWordmark size="compact" />
                  </Link>
                  <DashboardDevBuildBadge />
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted/50"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4">
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between gap-2 px-2">
                    <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
                      Agents
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-[11px] tabular-nums">
                        {ownedAgents.length}/{maxAgents}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 shrink-0 rounded-md border-border/80"
                        asChild
                      >
                        <Link
                          href="/dashboard/agents/new"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  {ownedAgents.map((agent) => {
                    const href = agentSwitchHref(pathname, agent.id);
                    const selected = activeAgent.id === agent.id;
                    return (
                      <Link
                        key={agent.id}
                        href={href}
                        onClick={() => {
                          selectAgent(agent.id);
                          setMobileMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-2 py-2.5 text-[15px] transition-colors",
                          selected
                            ? "bg-primary/10 text-foreground ring-1 ring-primary/20"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        )}
                      >
                        <AgentAvatar
                          image={agent.image}
                          name={agent.name}
                          size="sm"
                          className="shrink-0"
                        />
                        <span className="min-w-0 flex-1 truncate font-medium">{agent.name}</span>
                        <span className="flex shrink-0 items-center gap-1">
                          {agent.isVerified ? <VerifiedTick size="sm" /> : null}
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <nav className="space-y-1 border-t border-border/60 pt-3" aria-label="Workspace">
                  <DashboardWorkspaceNav
                    activeAgentId={activeAgent.id}
                    pathname={pathname}
                    onNavigate={() => setMobileMenuOpen(false)}
                    variant="mobile"
                    isDeveloper={isDeveloper}
                  />
                </nav>
              </div>
              <div className="border-t border-border/60 p-3">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-[15px] text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                  type="button"
                >
                  <LogOut className="h-[18px] w-[18px]" aria-hidden />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Main Workspace Column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Account Top Bar */}
          <header className="ui-topbar-shell sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between gap-2 px-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-muted/40"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/" className="shrink-0">
                <AgentRankingWordmark size="compact" />
              </Link>
              <DashboardDevBuildBadge />
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/"
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                ← Public Directory
              </Link>
              <span className="text-border">·</span>
              <span className="text-xs text-muted-foreground">
                Active Agent:{" "}
                <strong className="font-medium text-foreground">{activeAgent.name}</strong>
              </span>
            </div>

            <div className="ml-auto flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setCreditsDialogOpen(true)}
                className="ui-topbar-trigger inline-flex max-w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left"
                aria-label="Top up LLM credits"
              >
                <Coins className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <span className="hidden text-[11px] font-medium text-muted-foreground sm:inline">
                  Credits
                </span>
                <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
                  ${creditsUsd.toFixed(2)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPortfolioOpen(true)}
                className="ui-topbar-trigger inline-flex max-w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left"
                aria-label="Open wallet portfolio"
              >
                <Wallet className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <span className="truncate font-mono text-xs text-foreground">
                  14.82 SOL
                </span>
                <span className="font-mono text-xs text-muted-foreground sm:inline">
                  ($2,845)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setProfileDialogOpen(true)}
                className="ui-topbar-trigger flex max-w-[min(100%,14rem)] items-center gap-2 rounded-lg py-1 pl-1.5 pr-2 text-left"
                aria-label={`Edit profile for ${displayName}`}
              >
                <AgentAvatar
                  image="/ar-mark-square.png"
                  name={displayName}
                  size="sm"
                  className="shrink-0"
                />
                <span className="hidden truncate text-[13px] font-medium text-foreground sm:inline">
                  {displayName}
                </span>
              </button>
            </div>
          </header>

          {/* Main Content Area with Dithering Wave Background */}
          <main id="main" className="ui-main-youtube relative flex-1 overflow-y-auto">
            <DashboardMainWaveBackground />
            <div className="relative z-10">{children}</div>
          </main>
        </div>

        {/* Multi-Chain Wallet Portfolio Dialog */}
        <Dialog open={portfolioOpen} onOpenChange={setPortfolioOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Wallet className="size-4" aria-hidden />
                Wallet Portfolio
              </DialogTitle>
              <DialogDescription>
                Multi-chain custody across Solana &amp; EVM for {activeAgent.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/15 px-4 py-3">
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Total Portfolio Value
                    </p>
                    <p className="mt-0.5 font-mono text-2xl font-bold tabular-nums tracking-tight text-foreground">
                      $6,420.80
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-400">
                    +14.2% (24h)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  {
                    chain: "Solana Mainnet",
                    address: activeAgent.agentWallet,
                    balance: "14.82 SOL",
                    usd: "$2,845.40",
                    explorer: `https://solscan.io/account/${activeAgent.agentWallet}`,
                  },
                  {
                    chain: "Base (ERC-8004)",
                    address: activeAgent.owner,
                    balance: "0.84 ETH · 1,240 USDC",
                    usd: "$3,180.00",
                    explorer: `https://basescan.org/address/${activeAgent.owner}`,
                  },
                  {
                    chain: "Arbitrum One",
                    address: activeAgent.owner,
                    balance: "395.40 USDC",
                    usd: "$395.40",
                    explorer: `https://arbiscan.io/address/${activeAgent.owner}`,
                  },
                ].map((row) => (
                  <div
                    key={row.chain}
                    className="rounded-xl border border-border/50 bg-card/60 p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground">{row.chain}</span>
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {row.usd}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{row.balance}</p>
                    <div className="mt-2 flex items-center justify-between gap-2 border-t border-border/40 pt-2">
                      <code className="truncate font-mono text-[11px] text-muted-foreground">
                        {row.address}
                      </code>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => void copyAddress(row.address, row.chain)}
                        >
                          {copiedAddr === row.address ? (
                            <Check className="size-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          asChild
                        >
                          <a href={row.explorer} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-3.5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setPortfolioOpen(false)}>
                  Close
                </Button>
                <Button size="sm" asChild onClick={() => setPortfolioOpen(false)}>
                  <Link href={`/dashboard/agents/${activeAgent.id}/wallet`}>
                    Open Full Wallet
                  </Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* LLM Credit Top-Up Dialog */}
        <Dialog open={creditsDialogOpen} onOpenChange={setCreditsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="size-4" aria-hidden />
                Top Up LLM Inference Credits
              </DialogTitle>
              <DialogDescription>
                Fund autonomous agent chat, scheduled runs, and MCP tool execution with USDC or SOL.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/15 p-3.5">
                <p className="text-xs text-muted-foreground">Current Credit Balance</p>
                <p className="mt-1 font-mono text-2xl font-bold text-foreground">
                  ${creditsUsd.toFixed(2)}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[10, 25, 100].map((amt) => (
                  <Button
                    key={amt}
                    type="button"
                    variant="outline"
                    className="h-12 font-mono text-sm font-semibold"
                    onClick={() => addCreditsUsd(amt)}
                  >
                    +${amt}
                  </Button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Account Profile Dialog */}
        <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Operator Account</DialogTitle>
              <DialogDescription>
                Manage your creator display name and developer preview access.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="op-name">
                  Display Name
                </label>
                <input
                  id="op-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/15 p-3.5">
                <div>
                  <p className="text-sm font-medium">Developer Preview Sections</p>
                  <p className="text-xs text-muted-foreground">
                    Unlock Swap, Leverage, Copy Trade, and Agent Card in sidebar
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isDeveloper}
                  onChange={(e) => setIsDeveloper(e.target.checked)}
                  className="size-4 accent-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    showToast("Operator profile saved", "success");
                    setProfileDialogOpen(false);
                  }}
                >
                  Save changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DemoDashboardContext.Provider>
  );
}
