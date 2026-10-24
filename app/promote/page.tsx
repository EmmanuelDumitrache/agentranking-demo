"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Flame,
  Loader2,
  Megaphone,
  Sparkles,
  Star,
  AlertTriangle,
  CircleDollarSign,
  Wallet,
} from "lucide-react";
import { useCreatedAgentsStore } from "@/stores/created-agents-store";

type PromotionTier = "hot" | "featured";
type PaymentToken = "ETH" | "USDC" | "SOL";

interface PaymentOption {
  token: PaymentToken;
  label: string;
  network: string;
  amount: Record<PromotionTier, string>;
  usdEstimate: Record<PromotionTier, string>;
  networkWarning: string;
  explorerBaseUrl: string;
  explorerName: string;
  icon: string;
}

const TREASURY_EVM =
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS_EVM ??
  "0x8004TreasuryDemoAddress00000000000008004";
const TREASURY_SOL =
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS_SOL ??
  "8004ScannerDemoTreasurySolanaAddress1111111";

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    token: "ETH",
    label: "ETH on Base",
    network: "Base",
    amount: { hot: "0.05", featured: "0.1" },
    usdEstimate: { hot: "~$100", featured: "~$200" },
    networkWarning: "Send on Base network only — not Ethereum mainnet",
    explorerBaseUrl: "https://basescan.org/address/",
    explorerName: "BaseScan",
    icon: "Ξ",
  },
  {
    token: "USDC",
    label: "USDC on Base",
    network: "Base",
    amount: { hot: "100", featured: "200" },
    usdEstimate: { hot: "$100", featured: "$200" },
    networkWarning: "Send on Base network only — not Ethereum mainnet",
    explorerBaseUrl: "https://basescan.org/address/",
    explorerName: "BaseScan",
    icon: "$",
  },
  {
    token: "SOL",
    label: "SOL on Solana",
    network: "Solana",
    amount: { hot: "0.8", featured: "1.6" },
    usdEstimate: { hot: "~$100", featured: "~$200" },
    networkWarning: "Send on Solana mainnet only",
    explorerBaseUrl: "https://solscan.io/account/",
    explorerName: "Solscan",
    icon: "◎",
  },
];

const TIER_CONFIG = {
  hot: {
    title: "Hot Listing",
    description: "Appear in the Hot Agents feed with a flame badge for 7 days",
    icon: Flame,
    color: "text-orange-400",
    borderColor: "border-orange-400/40",
    bgColor: "bg-orange-400/10",
    hoverBorder: "hover:border-orange-400/60",
    activeBorder: "border-orange-400",
    activeBg: "bg-orange-400/15",
  },
  featured: {
    title: "Featured Listing",
    description:
      "Pinned to the homepage discovery section with a star badge for 7 days",
    icon: Star,
    color: "text-yellow-400",
    borderColor: "border-yellow-400/40",
    bgColor: "bg-yellow-400/10",
    hoverBorder: "hover:border-yellow-400/60",
    activeBorder: "border-yellow-400",
    activeBg: "bg-yellow-400/15",
  },
} as const;

function PromoteContent() {
  const searchParams = useSearchParams();
  const initialAgentId = searchParams.get("agentId") || "1";

  const [selectedTier, setSelectedTier] = useState<PromotionTier | null>("featured");
  const [selectedToken, setSelectedToken] = useState<PaymentToken | null>("ETH");
  const [agentId, setAgentId] = useState(initialAgentId);
  const [txHash, setTxHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [promotedAgentNumber, setPromotedAgentNumber] = useState<number | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const promoteAgentInStore = useCreatedAgentsStore((s) => s.promoteAgent);

  useEffect(() => {
    const qId = searchParams.get("agentId");
    if (qId) setAgentId(qId);
  }, [searchParams]);

  const selectedPayment = PAYMENT_OPTIONS.find(
    (p) => p.token === selectedToken
  );
  const treasuryAddress =
    selectedToken === "SOL" ? TREASURY_SOL : TREASURY_EVM;

  const copyAddress = () => {
    navigator.clipboard.writeText(treasuryAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fillDemoTx = () => {
    const randomHex = Math.floor(Date.now() * 1337).toString(16);
    setTxHash(`0xdemo${randomHex.padStart(58, "8")}`);
    if (!agentId.trim()) setAgentId("1");
  };

  const handleSubmit = async () => {
    if (!selectedTier || !selectedToken || !txHash.trim() || !agentId.trim())
      return;

    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txHash: txHash.trim(),
          paymentToken: selectedToken,
          tier: selectedTier,
          agentId: agentId.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const numericId = Number.parseInt(agentId.replace(/\D/g, ""), 10) || 1;
        promoteAgentInStore(numericId, selectedTier);
        setPromotedAgentNumber(numericId);
        setResult({
          success: true,
          message: `Payment verified! Agent #${numericId} now has an active ${selectedTier.toUpperCase()} badge across Discovery.`,
        });
        setTxHash("");
      } else {
        setResult({
          success: false,
          message: data.error || "Verification failed. Please check your transaction.",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      {/* Page header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Discovery
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
            <Megaphone className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Promote Your Agent
          </h1>
        </div>
        <p className="text-sm text-muted-foreground ml-[52px]">
          Boost your agent&apos;s visibility with a promoted listing.
          Payments accepted in ETH, USDC, and SOL (or use 1-Click Demo Tx below).
        </p>
      </div>

      <Separator />

      {/* Step 1: Tier selection */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
            1
          </span>
          <h2 className="text-lg font-medium text-foreground">
            Choose Promotion Tier
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.entries(TIER_CONFIG) as [PromotionTier, (typeof TIER_CONFIG)[PromotionTier]][]).map(
            ([tier, config]) => {
              const isActive = selectedTier === tier;
              const Icon = config.icon;
              return (
                <button
                  key={tier}
                  type="button"
                  onClick={() => {
                    setSelectedTier(tier);
                    setResult(null);
                  }}
                  className={cn(
                    "flex flex-col items-start gap-3 rounded-lg border p-5 text-left transition-all duration-200",
                    isActive
                      ? cn(config.activeBorder, config.activeBg)
                      : cn(
                          "border-border bg-card",
                          config.hoverBorder,
                          "hover:bg-accent/30"
                        )
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          config.bgColor
                        )}
                      >
                        <Icon className={cn("h-4.5 w-4.5", config.color)} />
                      </div>
                      <span className="font-semibold text-foreground">
                        {config.title}
                      </span>
                    </div>
                    {isActive && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {config.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {PAYMENT_OPTIONS.map((p) => (
                      <Badge
                        key={p.token}
                        variant="outline"
                        className="text-xs font-normal"
                      >
                        {p.amount[tier]} {p.token}
                        <span className="ml-1 text-muted-foreground">
                          {p.usdEstimate[tier]}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* Step 2: Payment method */}
      {selectedTier && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
              2
            </span>
            <h2 className="text-lg font-medium text-foreground">
              Select Payment Method
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {PAYMENT_OPTIONS.map((option) => {
              const isActive = selectedToken === option.token;
              return (
                <button
                  key={option.token}
                  type="button"
                  onClick={() => {
                    setSelectedToken(option.token);
                    setResult(null);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-4 transition-all duration-200",
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/40 hover:bg-accent/30"
                  )}
                >
                  <span className="text-2xl leading-none">{option.icon}</span>
                  <span className="text-sm font-medium text-foreground">
                    {option.label}
                  </span>
                  <div className="text-center">
                    <span className="text-lg font-semibold text-foreground">
                      {option.amount[selectedTier]}
                    </span>
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      {option.token}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {option.usdEstimate[selectedTier]}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-muted-foreground/70 flex items-center gap-1">
            <CircleDollarSign className="h-3 w-3" />
            USD estimates are approximate and may vary with market prices
          </p>
        </section>
      )}

      {/* Step 3: Payment details */}
      {selectedTier && selectedPayment && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
              3
            </span>
            <h2 className="text-lg font-medium text-foreground">
              Send Payment
            </h2>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Payment Details</CardTitle>
              <CardDescription>
                Send{" "}
                <span className="font-semibold text-foreground">
                  {selectedPayment.amount[selectedTier]}{" "}
                  {selectedPayment.token}
                </span>{" "}
                to the treasury address below, or use the Demo Transaction generator in Step 4.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Treasury Address ({selectedPayment.network})
                </Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded-md bg-muted/50 px-3 py-2.5 text-sm font-mono text-foreground ring-1 ring-border/30">
                    {treasuryAddress}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0"
                    onClick={copyAddress}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <a
                  href={`${selectedPayment.explorerBaseUrl}${treasuryAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Verify on {selectedPayment.explorerName}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Step 4: Verify payment */}
      {selectedTier && selectedPayment && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                4
              </span>
              <h2 className="text-lg font-medium text-foreground">
                Verify Payment
              </h2>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillDemoTx}
              className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Use Demo Transaction
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agent-id">Agent ID</Label>
                <Input
                  id="agent-id"
                  placeholder="Enter agent ID (e.g. 1, 2, 51)"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tx-hash">Transaction Hash</Label>
                <Input
                  id="tx-hash"
                  placeholder="Click 'Use Demo Transaction' above or paste 0x..."
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="font-mono"
                />
              </div>

              {result && (
                <div
                  className={cn(
                    "flex flex-col gap-3 rounded-lg border p-4",
                    result.success
                      ? "border-primary/30 bg-primary/5"
                      : "border-destructive/30 bg-destructive/5"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    {result.success ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    )}
                    <p
                      className={cn(
                        "text-sm",
                        result.success ? "text-primary" : "text-destructive"
                      )}
                    >
                      {result.message}
                    </p>
                  </div>
                  {result.success && promotedAgentNumber && (
                    <div className="flex flex-wrap gap-2 pl-6">
                      <Link href={`/agent/${promotedAgentNumber}`}>
                        <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
                          View Agent #{promotedAgentNumber}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Link href={selectedTier === "hot" ? "/hot" : "/"}>
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                          View on {selectedTier === "hot" ? "Hot Agents" : "Discovery"}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                disabled={!txHash.trim() || !agentId.trim() || submitting}
                onClick={handleSubmit}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    Verify &amp; Activate Promotion
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </section>
      )}

      <div className="h-8" />
    </div>
  );
}

export default function PromotePage() {
  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
      <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading promotion page...</div>}>
        <PromoteContent />
      </Suspense>
    </main>
  );
}
