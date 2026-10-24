"use client";
import { PublicSitePageShell } from "@/components/public-site/public-site-page-shell";
import { VerifiedPageHeader } from "@/components/verified/verified-page-header";
import { VerifiedVerificationPanel } from "@/components/verified/verified-verification-panel";
import { VerifiedDirectoryTable } from "@/components/verified/verified-directory-table";
import { VerifiedReferralFooter } from "@/components/verified/verified-referral-footer";
import type { VerifiedDirectoryPageData } from "@/lib/agent-directory/verified-directory";

export function VerifiedPage({ initialData }: { readonly initialData: VerifiedDirectoryPageData }) {
  return (
    <PublicSitePageShell className="verified-page-shell">
      <div className="verified-page">
        <VerifiedPageHeader />
        <VerifiedVerificationPanel />
        <VerifiedDirectoryTable
          agents={initialData.agents ?? []}
          total={initialData.total ?? 0}
          loading={false}
          loadingMore={false}
          error={null}
          hasMore={false}
          onRetry={() => {}}
          onLoadMore={() => {}}
        />
        <VerifiedReferralFooter />
      </div>
    </PublicSitePageShell>
  );
}
