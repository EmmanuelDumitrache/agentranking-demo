"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Share2,
  ExternalLink,
  CheckCircle2,
  Trophy,
  BarChart3,
  MessageSquare,
  Clock,
  Check,
  Flame,
  Megaphone,
  ShieldCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getTokenExplorerUrl } from "@/lib/chains";
import type { AgentData } from "@/lib/agent-data";
import { getDeterministicAgentMetrics } from "@/lib/mock-data";
import { useCreatedAgentsStore } from "@/stores/created-agents-store";
import { cn } from "@/lib/utils";

const AVATAR_SIZE = 56;

function AgentAvatar({
  image,
  name,
}: Readonly<{
  image?: string;
  name: string;
}>) {
  let imgSrc = image || `https://api.dicebear.com/7.x/shapes/png?seed=${encodeURIComponent(name)}&size=128`;
  const isDataUri = imgSrc.startsWith("data:");
  const isIpfs = imgSrc.startsWith("ipfs://");

  if (isIpfs) {
    const cid = imgSrc.replace(/^ipfs:\/\//, "");
    imgSrc = `https://ipfs.io/ipfs/${cid}`;
  }

  const wrapperClass =
    "shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-muted";

  if (isDataUri) {
    return (
      <div
        className={wrapperClass}
        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, minWidth: AVATAR_SIZE, minHeight: AVATAR_SIZE }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={name}
          className="h-full w-full object-cover"
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
        />
      </div>
    );
  }

  return (
    <div
      className={wrapperClass}
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, minWidth: AVATAR_SIZE, minHeight: AVATAR_SIZE }}
    >
      <Image
        src={imgSrc}
        alt={name}
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        sizes={`${AVATAR_SIZE}px`}
        className="h-full w-full object-cover"
        unoptimized={imgSrc.includes("ipfs") || imgSrc.includes("arweave") || imgSrc.includes("dicebear")}
      />
    </div>
  );
}

function chainTag(chainName: string, chainId: number): string {
  if (chainId === 1 || chainName === "Ethereum") return "ETH";
  return chainName;
}

function formatRelativeTime(ts: number): string {
  try {
    return formatDistanceToNow(new Date(ts * 1000), { addSuffix: true });
  } catch {
    return "—";
  }
}

const STAT_ICON_CLASS = "h-3.5 w-3.5 shrink-0 text-muted-foreground";

export function AgentHero({ agent }: Readonly<{ agent: AgentData }>) {
  const {
    agentId,
    chainId,
    chainName,
    metadata,
  } = agent;
  const rawName = metadata.name ?? `Agent #${agentId}`;
  const name = rawName;
  const description = metadata.description ?? "";
  const image = metadata.image;
  const supportedTrust = metadata.supportedTrust ?? [];
  const updatedAt = metadata.updatedAt;

  const favorites = useCreatedAgentsStore((s) => s.favorites);
  const toggleFavorite = useCreatedAgentsStore((s) => s.toggleFavorite);
  const promotions = useCreatedAgentsStore((s) => s.promotions);
  const userFeedback = useCreatedAgentsStore((s) => s.feedbackByAgent[agentId] ?? []);
  const createdAgents = useCreatedAgentsStore((s) => s.agents);
  const [shared, setShared] = useState(false);

  const isCreatedByUser = createdAgents.some((a) => Number(a.agentId) === Number(agentId));
  const deterministic = getDeterministicAgentMetrics(agentId);
  const rank = isCreatedByUser ? 1 : (agentId % 50) + 1;
  const overallScore = isCreatedByUser ? "94.2" : deterministic.reputation.toFixed(1);
  const commentsCount = (isCreatedByUser ? 12 : deterministic.feedbackCount) + userFeedback.length;
  const lastActive = updatedAt ? formatRelativeTime(updatedAt) : "just now";
  const isFavorite = favorites.includes(agentId);
  const promoTier = promotions[agentId];

  const hasVerifiedTrust =
    supportedTrust.length > 0 || isCreatedByUser;

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : `https://8004scanner.com/agent/${agentId}`;
    navigator.clipboard?.writeText(url);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Agents Discovery
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/verification?agentId=${agentId}`}>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Verify Agent
            </Button>
          </Link>
          <Link href={`/promote?agentId=${agentId}`}>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Megaphone className="h-3.5 w-3.5 text-orange-400" />
              Promote
            </Button>
          </Link>
        </div>
      </div>

      <section
        className="mx-auto max-w-6xl rounded-xl border border-border bg-card"
        style={{
          padding: "2.5rem 3rem",
        }}
      >
        <div className="flex flex-col space-y-3">
          {/* Row 1: Profile Pic + Agent Name | Actions (top right) */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center" style={{ gap: "16px" }}>
              <AgentAvatar image={image} name={rawName} />
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  {name}
                </h1>
                {promoTier === "featured" && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/40 gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </Badge>
                )}
                {promoTier === "hot" && (
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40 gap-1">
                    <Flame className="h-3 w-3 fill-current" />
                    Hot
                  </Badge>
                )}
              </div>
            </div>
            <TooltipProvider delayDuration={300}>
              <div className="flex items-center" style={{ gap: "0.375rem" }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={getTokenExplorerUrl(agent.chainId, agent.registry, agent.agentId)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9 shrink-0 [&_svg]:size-4"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View on Explorer</span>
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">View on Explorer</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => toggleFavorite(agentId)}
                      className={cn(
                        "h-9 w-9 shrink-0 [&_svg]:size-4",
                        isFavorite && "text-accent-green border border-accent-green/40"
                      )}
                    >
                      <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
                      <span className="sr-only">Favorite</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {isFavorite ? "Remove from Watchlist" : "Add to Watchlist"}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={handleShare}
                      className="h-9 w-9 shrink-0 [&_svg]:size-4"
                    >
                      {shared ? (
                        <Check className="h-4 w-4 text-accent-green" />
                      ) : (
                        <Share2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">Share</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {shared ? "Copied Link!" : "Copy Share Link"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>

          {/* Row 2: Chain badge */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-normal">
              {chainTag(chainName, chainId)}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              Agent #{agentId}
            </Badge>
          </div>

          {/* Row 3: Description */}
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed md:text-base">
              {description}
            </p>
          )}

          {/* Row 4: Stats — Rank · Overall score · Comments · Last Active · Verified */}
          <TooltipProvider delayDuration={300}>
            <div
              className="flex flex-wrap items-center gap-y-1 text-xs text-muted-foreground md:text-sm"
              style={{ gap: "0.5rem 2.5rem" }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex cursor-help items-center gap-2">
                    <Trophy className={STAT_ICON_CLASS} />
                    Rank #{rank}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Overall rank based on rating and feedback
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex cursor-help items-center gap-2 text-accent-green font-medium">
                    <BarChart3 className="h-3.5 w-3.5 shrink-0 text-accent-green" />
                    {overallScore} Score
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Aggregate score from ratings and engagement
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex cursor-help items-center gap-2">
                    <MessageSquare className={STAT_ICON_CLASS} />
                    {commentsCount} Feedback
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Number of user comments and feedback
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex cursor-help items-center gap-2">
                    <Clock className={STAT_ICON_CLASS} />
                    {lastActive}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  When this agent was last active
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/verification?agentId=${agentId}`}
                    className="flex items-center gap-2 text-accent-green hover:underline"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    {hasVerifiedTrust ? "ERC-8004 Verified" : "Inspect Trust"}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Click to inspect ERC-8004 registration &amp; KYA verification
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </section>
    </div>
  );
}
