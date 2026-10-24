import type { PublicSiteHomeData } from "@/lib/public-site/home-types";
import { buildDemoHomeData } from "@/lib/demo-store";

export async function loadPublicSiteHomeData(): Promise<PublicSiteHomeData> {
  return buildDemoHomeData();
}
