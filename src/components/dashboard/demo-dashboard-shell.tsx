"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Bot,
  Check,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  HelpCircle,
  LogOut,
  Menu,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Wallet,
  X,
} from "lucide-react";
import { RuntimeImage } from "@/components/shared/runtime-image";
import { AgentAvatar } from "@/components/shared/agent-avatar";
import { VerifiedTick } from "@/components/shared/verified-badge";
import { RegisteredTick } from "@/components/shared/registered-badge";
import { AgentRankingWordmark } from "@/components/layout/agent-ranking-wordmark";
import { DashboardWorkspaceNav } from "@/components/dashboard/dashboard-workspace-nav";
import { DashboardDevBuildBadge } from "@/components/dashboard/dashboard-nav-preview-access";
import { DashboardMainWaveBackground } from "@/components/dashboard/main-wave-background";
import { WhatsNewButton } from "@/components/dashboard/whats-new-button";
import { EthereumIcon } from "@/components/shared/ethereum-icon";
import { RobinhoodChainIcon } from "@/components/shared/robinhood-chain-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
const SIDEBAR_NAME_PRIVACY_KEY = "dashboard:hide-account-name";

type DemoDashboardContextValue = {
  readonly ownedAgents: DemoSeedAgent[];
  readonly activeAgent: DemoSeedAgent;
  readonly activeAgentId: number;
  readonly selectAgent: (id: number) => void;
  readonly refreshAgents: () => void;
  readonly creditsUsd: number;
  readonly addCreditsUsd: (amount: number) => void;
  readonly openCreditsDialog: () => void;
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

function SolanaIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("shrink-0", className)} width="14" height="14" viewBox="0 0 101 88" fill="none" aria-hidden>
      <path d="M100.48 69.38L83.81 86.8a3.2 3.2 0 0 1-2.83.89H1.94A1.32 1.32 0 0 1 .52 84.83L17.21 67.41a3.2 3.2 0 0 1 2.82-.89h79.03c.58 0 1.04.47 1.04 1.05 0 .26-.11.51-.3.7l-.32.31ZM83.81 34.3a3.2 3.2 0 0 1-2.83.89H1.94A1.32 1.32 0 0 1 .52 36.28L17.21 53.7a3.2 3.2 0 0 1 2.82.89h79.03c.58 0 1.04-.47 1.04-1.05 0-.26-.11.51-.3-.7l-.32-.31L83.81 34.3ZM1.94 21.79h79.03a3.2 3.2 0 0 1 2.84-.89l17.19-17.42a1.32 1.32 0 0 0-.52-2.17 1.32 1.32 0 0 0-1.04 0H20.03a3.2 3.2 0 0 1-2.82.89L.52 20.48a1.32 1.32 0 0 0 .33 1.07c.3.29.7.38 1.1.24Z" fill="url(#sol-grad-topbar)" />
      <defs>
        <linearGradient id="sol-grad-topbar" x1="8.53" y1="90.1" x2="88.99" y2="-3.02" gradientUnits="userSpaceOnUse">
          <stop offset=".08" stopColor="#9945FF" />
          <stop offset=".3" stopColor="#8752F3" />
          <stop offset=".5" stopColor="#5497D5" />
          <stop offset=".6" stopColor="#43B4CA" />
          <stop offset=".72" stopColor="#28E0B9" />
          <stop offset=".97" stopColor="#19FB9B" />
        </linearGradient>
      </defs>
    </svg>
  );
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
  const [nameHidden, setNameHidden] = useState(false);
  const [refreshSpinning, setRefreshSpinning] = useState(false);

  const refreshAgents = useCallback(() => {
    setOwnedAgents(getInitialOwnedAgents());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("public-site", "light");
    root.classList.add("agentranking-app", "dark");
    root.style.colorScheme = "dark";
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
      setNameHidden(window.localStorage.getItem(SIDEBAR_NAME_PRIVACY_KEY) === "1");
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

  const toggleNamePrivacy = useCallback(() => {
    const next = !nameHidden;
    setNameHidden(next);
    try {
      window.localStorage.setItem(SIDEBAR_NAME_PRIVACY_KEY, next ? "1" : "0");
    } catch {
      // ignore
    }
    showToast(next ? "Account name hidden." : "Account name visible.", "info");
  }, [nameHidden]);

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

  const openCreditsDialog = useCallback(() => {
    setCreditsDialogOpen(true);
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
  const isSolanaRegistered =
    activeAgent.chainId === SOLANA_CHAIN_ID || activeAgent.sapVerified;

  const contextValue = useMemo<DemoDashboardContextValue>(
    () => ({
      ownedAgents,
      activeAgent,
      activeAgentId: activeAgent.id,
      selectAgent,
      refreshAgents,
      creditsUsd,
      addCreditsUsd,
      openCreditsDialog,
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
      openCreditsDialog,
      isDeveloper,
    ],
  );

  return (
    <DemoDashboardContext.Provider value={contextValue}>
      <div className="app-surface ui-app relative min-h-screen">
        <DashboardMainWaveBackground />
        <div className="relative z-10 flex">
          {/* Desktop Sidebar — exact DOM & classes from 8004webapp/src/components/dashboard/sidebar.tsx */}
          <aside className="ui-sidebar ui-sidebar--docked ui-youtube-sidebar hidden w-[var(--app-sidebar-width,272px)] shrink-0 md:flex md:flex-col">
            <div className="ui-sidebar-header flex items-center gap-2">
              <Link href="/dashboard" className="inline-flex min-w-0 flex-1" title="Dashboard home">
                <AgentRankingWordmark className="gap-2" iconClassName="h-7 w-7" textClassName="text-sm" />
              </Link>
              {isDeveloper ? <DashboardDevBuildBadge /> : null}
            </div>
            <div className="ui-sidebar-scroll flex min-h-0 flex-1 flex-col px-3 py-3">
              <div className="ui-youtube-sidebar-agents shrink-0 space-y-1">
                <div className="flex items-center justify-between pl-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                      Agents
                    </span>
                    <span className="text-muted-foreground text-[10px] tabular-nums">
                      {ownedAgents.length}/{maxAgents}
                    </span>
                  </div>
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
                <div className="space-y-0.5">
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
                          "ui-youtube-agent-row flex items-center gap-3 text-sm",
                          selected
                            ? "ui-youtube-agent-row--active text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        aria-current={selected ? "page" : undefined}
                      >
                        <AgentAvatar
                          image={agent.image}
                          name={agent.name}
                          size="sm"
                          className="shrink-0"
                        />
                        <span className="min-w-0 flex-1 truncate font-medium text-[13px]">
                          {agent.name}
                        </span>
                        <span className="flex shrink-0 items-center gap-1">
                          {agent.isVerified ? <VerifiedTick size="sm" /> : null}
                          {isSol ? <RegisteredTick size="sm" /> : null}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <nav className="ui-youtube-sidebar-nav mt-3 space-y-0.5" aria-label="Workspace">
                <DashboardWorkspaceNav
                  activeAgentId={activeAgent.id}
                  pathname={pathname}
                  variant="desktop"
                  isDeveloper={isDeveloper}
                />
              </nav>

              {/* Guide me + What's new — pinned above the footer */}
              <div className="ui-youtube-sidebar-utilities mt-auto flex flex-row flex-wrap items-center justify-center gap-1 pb-2">
                <WhatsNewButton />
                <Popover open={guideOpen} onOpenChange={setGuideOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      Guide me
                    </button>
                  </PopoverTrigger>
                  <PopoverContent side="right" align="center" className="w-64 p-4">
                    <p className="text-sm font-medium">Creator workspace</p>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Create an agent, launch a token on Solana and other chains, and
                      earn creator fees. Fund your agent wallet, verify your identity,
                      and track performance from this dashboard.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Footer — account, social links, logout */}
              <div className="ui-youtube-sidebar-footer pt-2">
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <AgentAvatar
                    image="/ar-mark-square.png"
                    name={nameHidden ? "Account" : displayName}
                    size="sm"
                    className="shrink-0"
                  />
                  <span
                    className="min-w-0 flex-1 truncate text-[13px] font-medium"
                    aria-label={nameHidden ? "Account name hidden" : undefined}
                  >
                    {nameHidden ? "••••••••" : displayName}
                  </span>
                  <button
                    type="button"
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={toggleNamePrivacy}
                    aria-label={nameHidden ? "Show account name" : "Hide account name"}
                    title={nameHidden ? "Show account name" : "Hide account name"}
                  >
                    {nameHidden ? (
                      <EyeOff className="size-3.5" aria-hidden />
                    ) : (
                      <Eye className="size-3.5" aria-hidden />
                    )}
                  </button>
                  <button
                    type="button"
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setProfileDialogOpen(true)}
                    aria-label="Edit account profile"
                    title="Edit account profile"
                  >
                    <Settings className="size-3.5" aria-hidden />
                  </button>
                </div>

                <div className="flex items-center justify-between px-2 py-1">
                  <a
                    href="https://x.com/agentranking"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X / Twitter"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <span className="text-[15px] font-bold leading-none">𝕏</span>
                  </a>
                  <a
                    href="https://t.me/agentranking"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </a>
                  <Link
                    href="/docs"
                    aria-label="Docs"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="border-t border-border/60 pt-2">
                  <button
                    onClick={handleLogout}
                    className="ui-nav-link w-full text-left"
                    type="button"
                  >
                    <LogOut className="ui-nav-icon" aria-hidden />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content area — exact DOM & classes from 8004webapp/src/components/dashboard/dashboard-shell.tsx */}
          <div className="ui-dashboard-shell-stage relative flex min-h-screen min-w-0 flex-1 flex-col">
            <div className="ui-dashboard-shell-stage relative z-10 flex flex-1 flex-col">
              {/* Top bar — exact DOM & classes from 8004webapp/src/components/dashboard/account-top-bar.tsx */}
              <div className="ui-topbar-shell ui-youtube-topbar px-4">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="md:hidden inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border/60 hover:bg-muted/50"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="h-5 w-5" />
                  </button>

                  {/* Mobile: compact agent context */}
                  <div className="flex min-w-0 flex-1 items-center gap-2 md:hidden">
                    <AgentAvatar image={activeAgent.image} name={activeAgent.name} size="sm" />
                    <div className="min-w-0 leading-none">
                      <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider leading-none">
                        Agent
                      </p>
                      <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                        <span className="truncate text-sm font-medium leading-tight">
                          {activeAgent.name}
                        </span>
                        {activeAgent.isVerified ? <VerifiedTick size="sm" /> : null}
                        {isSolanaRegistered ? <RegisteredTick size="sm" /> : null}
                      </div>
                    </div>
                  </div>

                  {/* Desktop: selected agent identity */}
                  <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <AgentAvatar image={activeAgent.image} name={activeAgent.name} size="sm" />
                      <div className="min-w-0 leading-none">
                        <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider leading-none">
                          Selected
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className="truncate text-sm font-medium leading-tight">
                            {activeAgent.name}
                          </span>
                          {activeAgent.isVerified ? <VerifiedTick size="sm" /> : null}
                          {isSolanaRegistered ? <RegisteredTick size="sm" /> : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: multi-chain wallet pill + credits */}
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPortfolioOpen(true)}
                      className={cn(
                        "ui-youtube-topbar-control ui-youtube-topbar-control--compact flex items-center gap-1.5 text-sm",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      )}
                      aria-label="Portfolio $1,428.50. Open wallet details"
                      title="Agent portfolio"
                    >
                      <Wallet className="ui-topbar-control-icon h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span className="ui-topbar-control-value tabular-nums">
                        $1,428.50
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCreditsDialogOpen(true)}
                      className={cn(
                        "ui-youtube-topbar-control ui-youtube-topbar-control--compact flex items-center gap-1.5 text-sm",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      )}
                      aria-label={`LLM credit balance $${creditsUsd.toFixed(2)}. Add funds`}
                      title="LLM credits — click to add funds"
                    >
                      <Bot className="ui-topbar-control-icon h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span className="ui-topbar-control-value tabular-nums">
                        ${creditsUsd.toFixed(2)}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile nav drawer */}
              {mobileMenuOpen ? (
                <div
                  className="ui-mobile-nav-drawer fixed inset-0 z-50 md:hidden"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="dashboard-mobile-nav-title"
                >
                  <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden
                  />
                  <div className="ui-mobile-nav-sheet fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,272px)] flex-col bg-card shadow-2xl">
                    <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-3.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <AgentRankingWordmark size="compact" />
                        </Link>
                        {isDeveloper ? <DashboardDevBuildBadge /> : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-muted/50"
                        aria-label="Close menu"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <p id="dashboard-mobile-nav-title" className="sr-only">
                      Dashboard navigation
                    </p>
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
                              aria-label="Create agent"
                              asChild
                            >
                              <Link
                                href="/dashboard/agents/new"
                                onClick={() => setMobileMenuOpen(false)}
                              >
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
                              <span className="min-w-0 flex-1 truncate font-medium">
                                {agent.name}
                              </span>
                              <span className="flex shrink-0 items-center gap-1">
                                {agent.isVerified ? <VerifiedTick size="sm" /> : null}
                                {isSol ? <RegisteredTick size="sm" /> : null}
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
                        className="ui-nav-link w-full text-left"
                        type="button"
                      >
                        <LogOut className="ui-nav-icon" aria-hidden />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Page content */}
              <main id="dashboard-main-content" className="ui-main ui-page relative flex-1" tabIndex={-1}>
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Chain Agent Portfolio Dialog — exact match to 8004webapp/src/components/dashboard/account-top-bar.tsx */}
      <Dialog open={portfolioOpen} onOpenChange={setPortfolioOpen}>
        <DialogContent
          className="max-h-[min(92dvh,36rem)] gap-0 overflow-y-auto p-0 sm:max-w-md"
          overlayClassName="bg-black/50 backdrop-blur-md"
        >
          <DialogHeader className="gap-0 space-y-0 border-b border-border/60 px-4 py-3 pr-12 text-left">
            <div className="flex items-center gap-2.5">
              <AgentAvatar
                image={activeAgent.image}
                name={activeAgent.name}
                size="sm"
              />
              <div className="min-w-0">
                <DialogTitle className="truncate text-base font-medium">
                  {activeAgent.name}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs">
                  Agent portfolio
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-1 px-4 py-3 text-sm">
            <div className="mb-2 flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Portfolio total
              </span>
              <span className="font-semibold tabular-nums">$1,428.50</span>
            </div>
            <p className="text-muted-foreground pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider">
              Solana
            </p>
            <div className="flex items-center justify-between">
              <span className="flex min-w-0 items-center gap-1.5">
                <SolanaIcon className="h-4 w-4 shrink-0" />
                <span className="text-muted-foreground">SOL</span>
                <a
                  href={`https://solscan.io/account/${activeAgent.agentWallet}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/70 hover:text-foreground shrink-0 transition-colors"
                  aria-label="View on Solscan"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </span>
              <span className="font-semibold tabular-nums">4.82 SOL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <RuntimeImage
                  src="/chain-assets/usdc.webp"
                  alt="USDC"
                  aria-hidden
                  className="h-4 w-4 shrink-0 object-contain"
                />
                <span className="text-muted-foreground">USDC</span>
              </span>
              <span className="font-semibold tabular-nums">500</span>
            </div>
            <div className="flex items-center justify-between pb-2">
              <span className="flex items-center gap-2">
                <RuntimeImage
                  src="/chain-assets/agentranking.png"
                  alt="AR"
                  aria-hidden
                  className="h-4 w-4 shrink-0 object-contain"
                />
                <span className="text-muted-foreground">$AR</span>
              </span>
              <span className="font-semibold tabular-nums">12.5k</span>
            </div>
            <div className="pb-2">
              <div className="mt-0.5 flex items-center gap-1">
                <p className="text-muted-foreground text-[10px]">Address</p>
              </div>
              <p className="break-all font-mono text-[11px] leading-tight">
                {activeAgent.agentWallet}
              </p>
              <div className="mt-1 flex items-center gap-0.5">
                <button
                  type="button"
                  className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                  onClick={() => {
                    setRefreshSpinning(true);
                    setTimeout(() => {
                      setRefreshSpinning(false);
                      showToast("Wallet balances synced", "success");
                    }, 350);
                  }}
                  aria-label="Refresh Solana balance"
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", refreshSpinning && "animate-spin")} />
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                  onClick={() => void copyAddress(activeAgent.agentWallet, "Solana address")}
                  aria-label="Copy Solana address"
                >
                  {copiedAddr === activeAgent.agentWallet ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-muted-foreground pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider">
              EVM wallet
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex min-w-0 items-center gap-1.5">
                  <EthereumIcon className="h-4 w-4 shrink-0" />
                  <span className="text-muted-foreground truncate">Ethereum mainnet</span>
                  <a
                    href={`https://etherscan.io/address/${activeAgent.owner}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground/70 hover:text-foreground shrink-0 transition-colors"
                    aria-label="View on Etherscan"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </span>
                <span className="shrink-0 font-semibold tabular-nums">0.42 ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex min-w-0 items-center gap-1.5">
                  <RobinhoodChainIcon className="h-4 w-4 shrink-0" />
                  <span className="text-muted-foreground truncate">Robinhood</span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums">0.15 ETH</span>
              </div>
              <div className="pb-2">
                <div className="mt-0.5 flex items-center gap-1">
                  <p className="text-muted-foreground text-[10px]">Address</p>
                </div>
                <p className="break-all font-mono text-[11px] leading-tight">
                  {activeAgent.owner}
                </p>
                <div className="mt-1 flex items-center gap-0.5">
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => void copyAddress(activeAgent.owner, "EVM address")}
                    aria-label="Copy EVM address"
                  >
                    {copiedAddr === activeAgent.owner ? (
                      <Check className="h-3.5 w-3.5 text-green-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* LLM Inference Credits Top-Up Dialog */}
      <Dialog open={creditsDialogOpen} onOpenChange={setCreditsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Top Up LLM Inference Credits</DialogTitle>
            <DialogDescription>
              Fund your workspace balance for Claude 3.7 Sonnet, GPT-4.1, DeepSeek R1, and autonomous scheduled runs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
              <span className="text-sm text-muted-foreground">Current Balance</span>
              <span className="font-mono text-lg font-bold text-emerald-400">
                ${creditsUsd.toFixed(2)} USD
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[10, 25, 100].map((amt) => (
                <Button
                  key={amt}
                  type="button"
                  variant="outline"
                  className="h-11 font-mono font-semibold"
                  onClick={() => addCreditsUsd(amt)}
                >
                  +${amt}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Demo mode: instant credit top-up settled via simulated Solana USDC / x402 payment rail.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Account Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Account Profile</DialogTitle>
            <DialogDescription>
              Update your operator display name shown in the sidebar and creator credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Display Name</label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Operator Name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setProfileDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  try {
                    window.localStorage.setItem(
                      "agentranking_demo_session_v1",
                      JSON.stringify({
                        method: "demo",
                        displayName,
                        signedInAt: new Date().toISOString(),
                      }),
                    );
                  } catch {
                    // ignore
                  }
                  showToast("Account profile updated", "success");
                  setProfileDialogOpen(false);
                }}
              >
                Save changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DemoDashboardContext.Provider>
  );
}
