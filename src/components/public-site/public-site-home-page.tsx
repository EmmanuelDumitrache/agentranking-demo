import { LandingMotionPage } from "@/components/public-site/landing-motion/landing-motion-page";
import type { PublicSiteHomeData } from "@/lib/public-site/home-types";
import type { PublicStakeSummary } from "@/lib/public-stake-summary";

type Props = {
  readonly data: PublicSiteHomeData;
  readonly initialStakeSummary: PublicStakeSummary | null;
  readonly modelCount?: number;
};

/** Public homepage — motion-language landing with live index data. */
export function PublicSiteHomePage({ data, initialStakeSummary, modelCount }: Props) {
  return (
    <LandingMotionPage
      data={data}
      initialStakeSummary={initialStakeSummary}
      modelCount={modelCount}
    />
  );
}
