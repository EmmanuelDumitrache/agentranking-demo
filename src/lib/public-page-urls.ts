import {
  type PublicFooterColumn,
  type PublicNavItem,
  type PublicNavLink,
} from "@/lib/site-config";
import { resolveArDexScreenerUrl, resolveArSolscanTokenUrl } from "@/lib/ar-token-public";
import { buildPublicSiteNavLinks } from "@/lib/public-site/routes";

export function buildPublicNavLinks(): PublicNavItem[] {
  return buildPublicSiteNavLinks();
}

export function buildStakeNavLinks(): PublicNavLink[] {
  return [
    { label: "Home", href: "/", external: false },
    { label: "Agents", href: "/agents", external: false },
    { label: "Tokens", href: "/tokens", external: false },
    { label: "Create Agent", href: "/create", external: false },
    { label: "World", href: "/world", external: false },
    { label: "Docs", href: "/docs", external: false },
  ];
}

export function buildPublicFooterColumns(): PublicFooterColumn[] {
  return [
    {
      title: "Product",
      links: [
        { label: "Agents", href: "/agents" },
        { label: "Tokens", href: "/tokens" },
        { label: "Create Agent", href: "/create" },
        { label: "3D World", href: "/world" },
        { label: "MCP Connector", href: "/mcp" },
      ],
    },
    {
      title: "Platform",
      links: [
        { label: "Token Launchpad", href: "/launch" },
        { label: "Verification", href: "/verified" },
        { label: "Rankings", href: "/ranking" },
        { label: "Stake $AR", href: "/stake" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "About", href: "/about" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "GitHub", href: "https://github.com/EmmanuelDumitrache/agentranking-demo", external: true },
        { label: "X", href: "https://x.com/agentranking", external: true },
        { label: "Solscan", href: resolveArSolscanTokenUrl(), external: true },
        { label: "Dexscreener", href: resolveArDexScreenerUrl(), external: true },
      ],
    },
  ];
}

export const publicPageUrls = {
  publicSite: "/",
  app: "",
  stake: "/stake",
  dashboard: "/create",
  docs: "/docs",
  news: "/docs",
  verify: "/verified",
  verified: "/verified",
  agents: "/agents",
  tokens: "/tokens",
  ranking: "/ranking",
  mcp: "/mcp",
} as const;
