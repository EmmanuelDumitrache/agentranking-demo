"use client";

import { useState } from "react";
import { CheckCircle2, Coins, Lock, Sparkles, Wallet } from "lucide-react";
import { StakingDashboardFrame } from "@/app/stake/dashboard/staking-dashboard-frame";
import {
  PoweredByStreamflow,
  RewardEstimatePanel,
} from "@/app/stake/primitives";
import { StakeSiteSection } from "@/app/stake/shell/stake-site-section";
import { STAKE_LOCK_PERIOD_DAYS, type StakeLockDays } from "@/lib/stake-lock-periods";
import type { StakePageMetricsDto } from "@/lib/stake-page-data";
import type { StreamflowPoolConfigDto } from "@/lib/streamflow-stake-config";
import { STAKE_DASHBOARD_SECTION } from "@/lib/staking-config";
import { useFlywheelMetrics } from "./use-flywheel-metrics";
import { cn } from "@/lib/utils";

export function StakingInteractionSection({
  selectedLockDays,
  onSelectedLockDaysChange,
  initialMetrics,
}: {
  readonly selectedLockDays: StakeLockDays;
  readonly onSelectedLockDaysChange: (days: StakeLockDays) => void;
  readonly initialMetrics?: StakePageMetricsDto | null;
  readonly initialPoolConfig?: StreamflowPoolConfigDto | null;
}) {
  const [amountStr, setAmountStr] = useState("25000");
  const [demoBalance, setDemoBalance] = useState(100_000);
  const [stakedPositions, setStakedPositions] = useState<
    Array<{ id: string; amount: number; days: StakeLockDays; timestamp: string }>
  >([
    { id: "pos-1", amount: 50_000, days: 90, timestamp: "Active · 78 days remaining" },
  ]);
  const [justStaked, setJustStaked] = useState<string | null>(null);
  const { liveTotals } = useFlywheelMetrics(initialMetrics);

  const handleStakeDemo = () => {
    const parsed = Number.parseFloat(amountStr.replace(/,/g, ""));
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    setDemoBalance((b) => Math.max(0, b - parsed));
    setStakedPositions((prev) => [
      {
        id: `pos-${Date.now()}`,
        amount: parsed,
        days: selectedLockDays,
        timestamp: `Locked for ${selectedLockDays} days · Streamflow Pool`,
      },
      ...prev,
    ]);
    setJustStaked(`Staked ${parsed.toLocaleString()} $AR for ${selectedLockDays} days!`);
    setTimeout(() => setJustStaked(null), 5000);
  };

  return (
    <StakeSiteSection
      id="stake"
      eyebrow={STAKE_DASHBOARD_SECTION.eyebrow}
      title={STAKE_DASHBOARD_SECTION.title}
      description={STAKE_DASHBOARD_SECTION.subtitle}
      compact
      subtle
      className="scroll-mt-24"
    >
      <div className="ar-public-glass overflow-hidden rounded-xl">
        <PoweredByStreamflow variant="inline" className="px-4 pt-4 sm:px-5 sm:pt-5" />
        <StakingDashboardFrame
          left={
            <div className="space-y-5 p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <Wallet className="size-4 text-emerald-400" />
                  <span>Demo Wallet: 7xKX...gAsU</span>
                </div>
                <span className="font-mono text-xs font-semibold text-white">
                  Balance: {demoBalance.toLocaleString()} $AR
                </span>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <label htmlFor="stake-amount-input" className="font-medium text-white/80">
                    Amount to stake ($AR)
                  </label>
                  <div className="flex gap-1.5">
                    {[10_000, 25_000, 50_000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmountStr(String(preset))}
                        className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70 hover:bg-white/10 hover:text-white"
                      >
                        {(preset / 1000).toFixed(0)}K
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setAmountStr(String(demoBalance))}
                      className="rounded border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-white/15"
                    >
                      MAX
                    </button>
                  </div>
                </div>
                <input
                  id="stake-amount-input"
                  type="text"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="Enter $AR amount"
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 font-mono text-base text-white outline-none focus:border-white/40"
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-white/80">Lock duration</p>
                <div className="grid grid-cols-4 gap-2">
                  {STAKE_LOCK_PERIOD_DAYS.map((days) => {
                    const active = selectedLockDays === days;
                    return (
                      <button
                        key={days}
                        type="button"
                        onClick={() => onSelectedLockDaysChange(days)}
                        className={cn(
                          "flex flex-col items-center justify-center rounded-lg border py-2.5 text-xs font-medium transition-colors",
                          active
                            ? "border-white bg-white text-black"
                            : "border-white/10 bg-white/[0.03] text-white/75 hover:border-white/25 hover:text-white",
                        )}
                      >
                        <span className="font-semibold">{days}d</span>
                        <span className={cn("text-[10px]", active ? "text-black/70" : "text-white/45")}>
                          {days === 7 ? "1.0x" : days === 30 ? "1.4x" : days === 90 ? "2.0x" : "3.0x"} weight
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleStakeDemo}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                <Sparkles className="size-4" />
                Stake $AR ({selectedLockDays} Days Lock · Demo)
              </button>

              {justStaked ? (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-300">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>{justStaked}</span>
                </div>
              ) : null}

              <div className="space-y-2 border-t border-white/10 pt-4">
                <p className="text-xs font-medium uppercase tracking-wider text-white/50">
                  Your Active Streamflow Locks ({stakedPositions.length})
                </p>
                {stakedPositions.map((pos) => (
                  <div
                    key={pos.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="size-3.5 text-white/50" />
                      <span className="font-semibold text-white">
                        {pos.amount.toLocaleString()} $AR
                      </span>
                    </div>
                    <span className="text-white/60">{pos.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          }
          right={
            <RewardEstimatePanel
              selectedLockDays={selectedLockDays}
              amountStr={amountStr}
              totalStakedToken={liveTotals?.stakedSupplyToken ?? 142_850_000}
            />
          }
        />
      </div>
    </StakeSiteSection>
  );
}
