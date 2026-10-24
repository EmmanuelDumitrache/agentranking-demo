import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicRankingPage } from "@/components/ranking/public-ranking-page";
import { PublicSitePageShell } from "@/components/public-site/public-site-page-shell";
import { PublicSitePageHeader } from "@/components/public-site/public-site-ui";
import {
  parsePublicRankingInput,
  readPublicRankingPage,
  readPublicRankingSummary,
} from "@/lib/ranking/public-ranking.server";
import { publicSitePageMetadata } from "@/lib/public-site/seo-metadata";
import { publicSiteSocialOgImageUrl } from "@/lib/social-og-images";

export const metadata: Metadata = publicSitePageMetadata({
  title: "AI Agents | AgentRanking",
  description:
    "Browse AR-listed and indexed agents across every chain — AR Score, verification, and protocol signals in one directory.",
  path: "/agents",
  imageUrl: publicSiteSocialOgImageUrl("agents"),
});

export default async function AgentsPage() {
  const input = parsePublicRankingInput({});
  const data = await readPublicRankingPage(input);
  const summary = await readPublicRankingSummary();

  return (
    <PublicSitePageShell>
      <PublicSitePageHeader
        eyebrow="Directory"
        title="Agents"
        description="AR-listed launches and the global index. Tap AR to see agents created here."
      />
      <Suspense fallback={null}>
        <PublicRankingPage input={input} data={data} summary={summary} />
      </Suspense>
    </PublicSitePageShell>
  );
}
