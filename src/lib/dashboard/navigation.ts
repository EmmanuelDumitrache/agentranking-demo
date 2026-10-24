import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowLeftRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Brain,
  Coins,
  Copy,
  Cpu,
  CalendarClock,
  Code2,
  CreditCard,
  Fingerprint,
  IdCard,
  Layers,
  LayoutGrid,
  MessageSquare,
  Plug,
  Settings,
  Store,
  Terminal,
  TrendingUp,
  Wallet,
} from "lucide-react";

export type DashboardWorkspaceSection =
  | "overview"
  | "chat"
  | "memory"
  | "launchpad"
  | "schedule"
  | "wallet"
  | "register"
  | "card"
  | "trade-terminal"
  | "trade-swap"
  | "trade-perps"
  | "trade-copy"
  | "services"
  | "connections"
  | "inference"
  | "x402-market"
  | "verify"
  | "credentials"
  | "github"
  | "health"
  | "analytics"
  | "rankings"
  | "monetize"
  | "social"
  | "referrals"
  | "settings";

export type DashboardNavItem = {
  id: DashboardWorkspaceSection;
  label: string;
  icon: LucideIcon;
  href: string;
};

export type DashboardNavGroupId =
  | "agent"
  | "trade"
  | "build"
  | "insights"
  | "account";

export type DashboardNavGroupDef = {
  id: DashboardNavGroupId;
  label: string;
  icon: LucideIcon;
  sectionIds: DashboardWorkspaceSection[];
};

export type DashboardWorkspaceNavTree = {
  overview: DashboardNavItem;
  groups: Array<{ group: DashboardNavGroupDef; items: DashboardNavItem[] }>;
  settings: DashboardNavItem;
};

export const APP_DASHBOARD_BASE = "/dashboard";

export function appDashboardAgentHref(
  agentDbId: number,
  section: Exclude<
    DashboardWorkspaceSection,
    "referrals" | "settings" | "overview" | "x402-market" | "card" | "verify" | "credentials"
  >,
): string {
  const base = `${APP_DASHBOARD_BASE}/agents/${agentDbId}`;
  switch (section) {
    case "launchpad":
      return `${base}/launchpad`;
    case "schedule":
      return `${base}/schedule`;
    case "chat":
      return `${base}/chat`;
    case "memory":
      return `${base}/memory`;
    case "wallet":
      return `${base}/wallet`;
    case "register":
      return `${base}/register`;
    case "trade-terminal":
      return `${base}/trade/terminal`;
    case "trade-swap":
      return `${base}/trade/swap`;
    case "trade-perps":
      return `${base}/trade/perps`;
    case "trade-copy":
      return `${base}/trade/copy`;
    case "services":
      return `${base}/services`;
    case "connections":
      return `${base}/connections`;
    case "inference":
      return `${base}/inference`;
    case "github":
      return `${base}/github`;
    case "health":
      return `${base}/health`;
    case "analytics":
      return `${base}/analytics`;
    case "rankings":
      return `${base}/rankings`;
    case "monetize":
      return `${base}/monetize`;
    case "social":
      return `${base}/social`;
    default: {
      const _exhaustive: never = section;
      return _exhaustive;
    }
  }
}

export function resolveWorkspaceHref(
  section: DashboardWorkspaceSection,
  agentDbId: number | null,
): string {
  if (section === "overview") {
    return agentDbId != null
      ? `${APP_DASHBOARD_BASE}/agents/${agentDbId}`
      : APP_DASHBOARD_BASE;
  }
  if (section === "referrals") {
    return `${APP_DASHBOARD_BASE}/referrals`;
  }
  if (section === "settings") {
    return `${APP_DASHBOARD_BASE}/settings`;
  }
  if (section === "x402-market") {
    return `${APP_DASHBOARD_BASE}/x402-market`;
  }
  if (section === "wallet") {
    return agentDbId != null
      ? `${APP_DASHBOARD_BASE}/agents/${agentDbId}/wallet`
      : `${APP_DASHBOARD_BASE}/wallet`;
  }
  if (section === "card") {
    return `${APP_DASHBOARD_BASE}/card`;
  }
  if (section === "verify") {
    return `${APP_DASHBOARD_BASE}/verify`;
  }
  if (section === "credentials") {
    return `${APP_DASHBOARD_BASE}/credentials`;
  }
  if (section === "connections") {
    return agentDbId != null
      ? `${APP_DASHBOARD_BASE}/agents/${agentDbId}/connections`
      : `${APP_DASHBOARD_BASE}/connections`;
  }
  if (agentDbId != null) {
    return appDashboardAgentHref(
      agentDbId,
      section as Exclude<
        DashboardWorkspaceSection,
        "referrals" | "settings" | "overview" | "x402-market" | "card" | "verify" | "credentials"
      >,
    );
  }
  return APP_DASHBOARD_BASE;
}

const DASHBOARD_PRIMARY_NAV_IDS = new Set<DashboardWorkspaceSection>([
  "overview",
  "chat",
  "memory",
  "launchpad",
  "schedule",
  "card",
  "wallet",
  "register",
  "trade-terminal",
  "trade-swap",
  "trade-perps",
  "trade-copy",
  "inference",
  "x402-market",
  "services",
  "connections",
  "verify",
  "credentials",
  "settings",
  "github",
  "monetize",
  "analytics",
  "rankings",
  "health",
]);

const DASHBOARD_NAV_GROUPS: DashboardNavGroupDef[] = [
  {
    id: "agent",
    label: "Agent",
    icon: Bot,
    sectionIds: ["chat", "launchpad", "schedule", "wallet", "register"],
  },
  {
    id: "trade",
    label: "Trade",
    icon: ArrowLeftRight,
    sectionIds: ["trade-terminal", "trade-swap", "trade-perps", "trade-copy"],
  },
  {
    id: "build",
    label: "Build",
    icon: Layers,
    sectionIds: ["memory", "inference", "x402-market", "services", "connections", "github", "monetize"],
  },
  {
    id: "insights",
    label: "Insights",
    icon: BarChart3,
    sectionIds: ["analytics", "rankings", "health"],
  },
  {
    id: "account",
    label: "Account",
    icon: CreditCard,
    sectionIds: ["verify", "credentials", "card"],
  },
];

const DASHBOARD_NAV_ICONS: Record<DashboardWorkspaceSection, LucideIcon> = {
  overview: LayoutGrid,
  chat: MessageSquare,
  memory: Brain,
  launchpad: Coins,
  schedule: CalendarClock,
  card: CreditCard,
  wallet: Wallet,
  register: Fingerprint,
  "trade-terminal": Terminal,
  "trade-swap": ArrowLeftRight,
  "trade-perps": TrendingUp,
  "trade-copy": Copy,
  inference: Cpu,
  "x402-market": Store,
  verify: BadgeCheck,
  credentials: IdCard,
  rankings: BadgeCheck,
  analytics: BarChart3,
  settings: Settings,
  services: Layers,
  connections: Plug,
  github: Code2,
  health: Activity,
  monetize: Store,
  social: MessageSquare,
  referrals: Settings,
};

const DASHBOARD_NAV_LABELS: Record<DashboardWorkspaceSection, string> = {
  overview: "Overview",
  chat: "Chat",
  memory: "Memory",
  launchpad: "Token",
  schedule: "Schedule",
  card: "Card",
  wallet: "Wallet",
  register: "Register",
  "trade-terminal": "Terminal",
  "trade-swap": "Swap",
  "trade-perps": "Leverage",
  "trade-copy": "Copy Trade",
  inference: "Inference",
  "x402-market": "x402 Market",
  verify: "Verification",
  credentials: "Credentials",
  rankings: "Rankings",
  analytics: "Analytics",
  settings: "Settings",
  services: "Services",
  connections: "Connections",
  github: "GitHub",
  health: "Health",
  monetize: "Monetize",
  social: "Social",
  referrals: "Referrals",
};

const AGENT_SCOPED_NAV_IDS = new Set<DashboardWorkspaceSection>([
  "chat",
  "memory",
  "launchpad",
  "schedule",
  "wallet",
  "register",
  "trade-terminal",
  "trade-swap",
  "trade-perps",
  "trade-copy",
  "inference",
  "services",
  "github",
  "monetize",
  "analytics",
  "rankings",
  "health",
]);

function buildNavItem(
  id: DashboardWorkspaceSection,
  agentDbId: number | null,
): DashboardNavItem | null {
  if (!DASHBOARD_PRIMARY_NAV_IDS.has(id)) return null;
  if (agentDbId == null && AGENT_SCOPED_NAV_IDS.has(id)) return null;
  return {
    id,
    label: DASHBOARD_NAV_LABELS[id],
    icon: DASHBOARD_NAV_ICONS[id],
    href: resolveWorkspaceHref(id, agentDbId),
  };
}

export function buildDashboardWorkspaceNavTree(
  agentDbId: number | null,
): DashboardWorkspaceNavTree {
  const overview = buildNavItem("overview", agentDbId);
  const settings = buildNavItem("settings", agentDbId);
  if (!overview || !settings) {
    throw new Error("Workspace nav tree requires overview and settings items");
  }
  const groups = DASHBOARD_NAV_GROUPS.map((group) => ({
    group,
    items: group.sectionIds
      .map((sectionId) => buildNavItem(sectionId, agentDbId))
      .filter((item): item is DashboardNavItem => item != null),
  })).filter((entry) => entry.items.length > 0);
  return { overview, groups, settings };
}

function cleanDashboardPath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || APP_DASHBOARD_BASE;
}

export function isDashboardNavGroupActive(
  pathname: string,
  items: readonly DashboardNavItem[],
): boolean {
  const cleanPath = cleanDashboardPath(pathname);
  if (items.some((item) => isDashboardNavActive(cleanPath, item.href))) {
    return true;
  }
  if (items.some((item) => item.id.startsWith("trade-"))) {
    const agentId = parseDashboardAgentDbIdFromPath(cleanPath);
    if (agentId != null) {
      const tradeRoot = `${APP_DASHBOARD_BASE}/agents/${agentId}/trade`;
      return cleanPath === tradeRoot || cleanPath.startsWith(`${tradeRoot}/`);
    }
  }
  return false;
}

export function activeDashboardNavGroupIds(
  pathname: string,
  tree: DashboardWorkspaceNavTree,
): DashboardNavGroupId[] {
  const cleanPath = cleanDashboardPath(pathname);
  return tree.groups
    .filter(({ items }) => isDashboardNavGroupActive(cleanPath, items))
    .map(({ group }) => group.id);
}

export function buildDashboardWorkspaceNav(agentDbId: number | null): DashboardNavItem[] {
  const tree = buildDashboardWorkspaceNavTree(agentDbId);
  const items: DashboardNavItem[] = [tree.overview];
  for (const entry of tree.groups) {
    items.push(...entry.items);
  }
  items.push(tree.settings);
  return items;
}

export function parseDashboardAgentDbIdFromPath(pathname: string): number | null {
  const cleanPath = cleanDashboardPath(pathname);
  const match = /^\/dashboard\/agents\/(\d+)(?:\/|$)/.exec(cleanPath);
  if (!match) return null;
  const id = Number.parseInt(match[1], 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function workspaceSectionLabel(
  section: DashboardWorkspaceSection,
): string {
  return DASHBOARD_NAV_LABELS[section];
}

export function isDashboardNavActive(pathname: string, href: string): boolean {
  if (!href || href === "#") return false;
  const cleanPath = cleanDashboardPath(pathname);
  const cleanHref = cleanDashboardPath(href);
  if (cleanPath === cleanHref) return true;
  const agentId = parseDashboardAgentDbIdFromPath(cleanHref);
  if (agentId != null) {
    const overviewHref = `${APP_DASHBOARD_BASE}/agents/${agentId}`;
    if (cleanHref === overviewHref) {
      return cleanPath === cleanHref || cleanPath === APP_DASHBOARD_BASE;
    }
    return cleanPath.startsWith(`${cleanHref}/`) || cleanPath === cleanHref;
  }
  if (cleanHref === APP_DASHBOARD_BASE) {
    return cleanPath === APP_DASHBOARD_BASE;
  }
  return cleanPath.startsWith(`${cleanHref}/`);
}

export function defaultDashboardAgentPath(agentDbId: number): string {
  return `${APP_DASHBOARD_BASE}/agents/${agentDbId}`;
}

export function agentSwitchHref(pathname: string, targetAgentDbId: number): string {
  const cleanPath = cleanDashboardPath(pathname);
  if (/^\/dashboard\/agents\/\d+/.test(cleanPath)) {
    return cleanPath.replace(/^\/dashboard\/agents\/\d+/, `/dashboard/agents/${targetAgentDbId}`);
  }
  return `/dashboard/agents/${targetAgentDbId}`;
}
