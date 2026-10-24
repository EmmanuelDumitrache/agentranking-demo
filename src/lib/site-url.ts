const DEMO_SITE_URL = "https://agentrankingdemo.netlify.app";

export function localDevProtocol(): "http:" | "https:" {
  return "http:";
}

export function localDevPortSuffix(port = "3000"): string {
  return `:${port}`;
}

export function getPublicSiteUrl(): string {
  return DEMO_SITE_URL;
}

export function getAppProductSiteUrl(): string {
  return "";
}

export function getStakeSiteUrl(): string {
  return DEMO_SITE_URL;
}

export function getStakePageUrl(): string {
  return "/stake";
}

export function getAnalyticsSiteUrl(): string {
  return "/agents";
}

export function getAdminLoginBaseUrl(): string {
  return DEMO_SITE_URL;
}

export function getMetadataBase(): URL {
  return new URL(DEMO_SITE_URL);
}

export function absoluteUrl(path: string): string {
  if (!path) return DEMO_SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${DEMO_SITE_URL}${normalizedPath}`;
}

export function appAbsoluteUrl(path: string): string {
  if (!path) return "/dashboard";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

export function docsAbsoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!path || path === "/docs") return `${DEMO_SITE_URL}/docs`;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${DEMO_SITE_URL}${normalizedPath}`;
}

export function getAppHomeUrl(): string {
  return "/";
}

export function buildLocalDevAppHomeUrl(): string {
  return "/";
}

export function getDashboardSiteUrl(): string {
  return "";
}

export function getDashboardHomeUrl(): string {
  return "/dashboard";
}

export function dashboardAbsoluteUrl(path: string): string {
  if (!path) return "/dashboard";
  return path.startsWith("/") ? path : `/${path}`;
}

export function resolveAppHomeHrefFromHost(): string {
  return "/";
}

export function isAppHomeNavHref(href: string, pathname: string): boolean {
  return (pathname === "/" || pathname === "") && (href === "/" || href === "");
}
