import type { PublicNavItem } from "@/lib/site-config";
import { getPublicSiteUrl } from "@/lib/site-url";

export const publicSiteRoutes = {
  tokens: "/tokens",
  agents: "/agents",
  world: "/world",
  ranking: "/ranking",
  docs: "/docs",
  mcp: "/mcp",
  stake: "/stake",
  stakeDocs: "/docs/ar-token",
  launchAgent: "/create",
  launchApp: "/create",
  launchAgentApp: "/create",
  createAgent: "/create",
  launchToken: "/launch",
} as const;

export function publicSiteAbsoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getPublicSiteUrl()}${normalized}`;
}

export function buildPublicSiteNavLinks(): PublicNavItem[] {
  return [
    { label: "Agents", href: publicSiteRoutes.agents },
    { label: "Tokens", href: publicSiteRoutes.tokens },
    { label: "Create Agent", href: publicSiteRoutes.createAgent },
    { label: "Launchpad", href: publicSiteRoutes.launchToken },
    { label: "World", href: publicSiteRoutes.world },
    { label: "MCP", href: publicSiteRoutes.mcp },
    { label: "Docs", href: publicSiteRoutes.docs },
    { label: "Stake", href: publicSiteRoutes.stake },
  ];
}

export function publicTokenDetailHref(mint: string): string {
  return `${publicSiteRoutes.tokens}/${mint}`;
}
