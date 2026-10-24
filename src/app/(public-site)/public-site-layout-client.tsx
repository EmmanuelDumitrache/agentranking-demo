"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { PublicSiteChrome } from "@/components/public-site/public-site-chrome";
import { QueryProvider } from "@/providers/query-provider";
import providerScope from "@/lib/public-site/provider-scope.json";
import type { PublicFooterColumn, PublicNavItem } from "@/lib/site-config";

const AuthWalletProviders = dynamic(() =>
  import("@/providers/auth-wallet-providers").then(
    (module) => module.AuthWalletProviders,
  ),
);

const FOOTER_HIDDEN_PREFIXES = ["/agents", "/tokens", "/world"] as const;

type RouteScope = {
  readonly exact: readonly string[];
  readonly prefixes: readonly string[];
};

function pathMatchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function pathMatchesScope(pathname: string, scope: RouteScope): boolean {
  return (
    scope.exact.includes(pathname) ||
    scope.prefixes.some((prefix) => pathMatchesPrefix(pathname, prefix))
  );
}

function shouldShowPublicSiteFooter(pathname: string): boolean {
  return !FOOTER_HIDDEN_PREFIXES.some((prefix) => pathMatchesPrefix(pathname, prefix));
}

export function PublicSiteLayoutClient({
  children,
  navLinks,
  footerColumns,
}: {
  readonly children: React.ReactNode;
  readonly navLinks: readonly PublicNavItem[];
  readonly footerColumns: readonly PublicFooterColumn[];
}) {
  const pathname = usePathname() ?? "/";
  const cleanPathname = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const isHome = cleanPathname === "/";
  const isWorld = cleanPathname === "/world";
  const needsWallet = pathMatchesScope(cleanPathname, providerScope.wallet);

  const pageBody =
    isHome || isWorld ? children : <div className="ui-public-site-container">{children}</div>;

  return (
    <QueryProvider>
      <PublicSiteChrome
        navLinks={navLinks}
        footerColumns={footerColumns}
        showFooter={shouldShowPublicSiteFooter(cleanPathname) && !isHome}
        hideWaveBackground={isHome || isWorld}
        hideNav={isHome || isWorld}
        mainClassName={
          isHome
            ? "ui-main--landing-motion"
            : isWorld
              ? "ui-main--world !p-0 !overflow-hidden"
              : undefined
        }
      >
        {needsWallet ? <AuthWalletProviders>{pageBody}</AuthWalletProviders> : pageBody}
      </PublicSiteChrome>
    </QueryProvider>
  );
}
