import type { Metadata } from "next";
import { PublicSitePageShell } from "@/components/public-site/public-site-page-shell";
import { PublicTokenDetailPage } from "@/components/public-site/token-detail-page";
import { loadPublicTokenDetailData } from "@/lib/public-site/token-detail-data.server";
import {
  getOfficialPublicToken,
  OFFICIAL_PUBLIC_TOKENS,
} from "@/lib/public-site/official-tokens";
import { publicSitePageMetadata } from "@/lib/public-site/seo-metadata";
import { tokenSocialOgImageUrl } from "@/lib/social-og-images";
import { DEMO_SEED_AGENTS } from "@/lib/demo-store";

export function generateStaticParams() {
  const mints = new Set<string>();
  for (const official of OFFICIAL_PUBLIC_TOKENS) {
    mints.add(official.mint);
  }
  for (const agent of DEMO_SEED_AGENTS) {
    if (agent.token?.mint) {
      mints.add(agent.token.mint);
    }
  }
  return Array.from(mints).map((mint) => ({ mint }));
}

type Props = { params: Promise<{ mint: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mint } = await params;
  const official = getOfficialPublicToken(mint);
  if (official) {
    return publicSitePageMetadata({
      title: `${official.name} ($${official.symbol}) | AgentRanking`,
      description: official.description,
      path: `/tokens/${mint}`,
      imageUrl: tokenSocialOgImageUrl(mint),
    });
  }
  const data = await loadPublicTokenDetailData(mint);
  const tokenName =
    data.profile.displayName || data.launch.tokenName || `Token ${mint.slice(0, 8)}…`;
  const symbol = data.launch.tokenSymbol ? ` ($${data.launch.tokenSymbol})` : "";
  const description =
    data.profile.shortDescription ||
    data.launch.tokenDescription ||
    `AgentRanking-launched token ${mint.slice(0, 8)}… on Solana.`;
  return publicSitePageMetadata({
    title: `${tokenName}${symbol} | AgentRanking`,
    description,
    path: `/tokens/${mint}`,
    imageUrl: tokenSocialOgImageUrl(mint),
  });
}

export default async function PublicTokenDetailPageRoute({ params }: Props) {
  const { mint } = await params;
  const data = await loadPublicTokenDetailData(mint);
  return (
    <PublicSitePageShell>
      <PublicTokenDetailPage data={data} />
    </PublicSitePageShell>
  );
}
