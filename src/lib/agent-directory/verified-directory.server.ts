import {
  VERIFIED_DIRECTORY_PAGE_SIZE,
  type VerifiedDirectoryPageData,
} from "@/lib/agent-directory/verified-directory";
import { buildDemoVerifiedDirectoryPage } from "@/lib/demo-store";

export async function readVerifiedDirectoryPage(
  page = 1,
  perPage = VERIFIED_DIRECTORY_PAGE_SIZE,
): Promise<VerifiedDirectoryPageData> {
  return buildDemoVerifiedDirectoryPage(page, perPage);
}
