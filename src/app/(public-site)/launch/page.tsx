import type { Metadata } from "next";
import { Suspense } from "react";
import { publicSitePageMetadata } from "@/lib/public-site/seo-metadata";
import { PublicQuickLaunchPage } from "@/components/public-launch/public-quick-launch-page";
import { publicSiteRoutes } from "@/lib/public-site/routes";
import { readPublicQuickLaunchInitialState } from "@/lib/public-launch/initial-state.server";

export const metadata: Metadata = publicSitePageMetadata({
  title: "Launch Token | AgentRanking",
  description:
    "Wallet-only quick launchpad for Solana Pump.fun and Robinhood Chain tokens — no sign-in required.",
  path: "/launch",
});

export default async function PublicLaunchPage() {
  const initialChain = "solana" as const;
  const initial = await readPublicQuickLaunchInitialState({
    chain: initialChain,
    attemptId: null,
  });
  return (
    <Suspense fallback={null}>
      <PublicQuickLaunchPage
        launchAgentHref={publicSiteRoutes.launchAgent}
        initialChain={initialChain}
        initialAttemptId={null}
        initialWalletSession={initial.walletSession}
        initialOpenMetaplexAttempt={initial.openMetaplexAttempt}
        initialRobinhoodLaunchFeeEth={initial.robinhoodLaunchFeeEth}
        feeDisplay={initial.feeDisplay}
      />
    </Suspense>
  );
}
