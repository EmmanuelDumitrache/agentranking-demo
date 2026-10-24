"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight, ExternalLink, MessageSquarePlus, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getExplorerUrl } from "@/lib/chains";
import { truncateAddress, cn } from "@/lib/utils";
import type { AgentData } from "@/lib/agent-data";
import { useCreatedAgentsStore } from "@/stores/created-agents-store";

const PAGE_SIZE = 10;

const INITIAL_FEEDBACK = [
  {
    id: "init-1",
    address: "0x4Da0a1b2c3d4e5f67890123456789012345f22",
    comment: "Quick response times and clean MCP schema output. Would recommend.",
    tags: ["mcp", "fast"],
    timestamp: Math.floor(Date.now() / 1000) - 3600 * 5,
    score: 100,
  },
  {
    id: "init-2",
    address: "0xeF26a1b2c3d4e5f6789012345678901234d645",
    comment: "Helped automate our cross-chain vault monitoring workflow. Five stars.",
    tags: ["reliable", "defi"],
    timestamp: Math.floor(Date.now() / 1000) - 86400 * 1,
    score: 95,
  },
  {
    id: "init-3",
    address: "0x64Bea1b2c3d4e5f6789012345678901234dFf8",
    comment: "Excellent X402 payment integration and predictable gas overhead.",
    tags: ["x402"],
    timestamp: Math.floor(Date.now() / 1000) - 86400 * 2,
    score: 100,
  },
  {
    id: "init-4",
    address: "0x7703a1b2c3d4e5f6789012345678901234eb6F",
    comment: "Solid agent overall, occasional rate-limit during high L1 congestion.",
    tags: ["latency"],
    timestamp: Math.floor(Date.now() / 1000) - 86400 * 4,
    score: 75,
  },
];

export function FeedbackSection({ agent }: { agent: AgentData }) {
  const [page, setPage] = useState(1);
  const [comment, setComment] = useState("");
  const [voteScore, setVoteScore] = useState<number>(100);
  const { chainId, agentId } = agent;

  const userFeedback = useCreatedAgentsStore((s) => s.feedbackByAgent[agentId] ?? []);
  const addFeedback = useCreatedAgentsStore((s) => s.addFeedback);

  const allFeedback = [...userFeedback, ...INITIAL_FEEDBACK];
  const total = allFeedback.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, total);
  const items = allFeedback.slice(start, end);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addFeedback(agentId, {
      id: `user-fb-${Date.now()}`,
      address: "0xDemoUser71C8F902A4B3E6D19000000000008004",
      comment: comment.trim(),
      tags: voteScore >= 70 ? ["verified-demo", "positive"] : ["needs-review"],
      timestamp: Math.floor(Date.now() / 1000),
      score: voteScore,
    });
    setComment("");
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Interactive Leave Feedback Form */}
      <Card>
        <CardHeader className="px-6 pt-6 pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquarePlus className="h-4 w-4 text-primary" />
            Leave Community Feedback (Demo)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Test the feedback pipeline by rating this agent and posting a review.
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={voteScore === 100 ? "default" : "outline"}
                onClick={() => setVoteScore(100)}
                className="gap-1.5"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                Positive (100/100)
              </Button>
              <Button
                type="button"
                size="sm"
                variant={voteScore === 80 ? "default" : "outline"}
                onClick={() => setVoteScore(80)}
                className="gap-1.5"
              >
                Solid (80/100)
              </Button>
              <Button
                type="button"
                size="sm"
                variant={voteScore === 30 ? "destructive" : "outline"}
                onClick={() => setVoteScore(30)}
                className="gap-1.5"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
                Issue (30/100)
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Write a review for this agent (e.g., 'Tested MCP endpoint, fast response!')..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!comment.trim()}>
                Post Feedback
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-6 pt-6">
          <CardTitle className="text-base">All Feedback ({total})</CardTitle>
          <p className="text-sm text-muted-foreground">
            Community and validator reviews recorded for {agent.metadata.name ?? `Agent #${agentId}`}.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-6">
          <div className="flex flex-col gap-4">
            {items.map((item) => {
              const explorerHref = getExplorerUrl(chainId, "address", item.address);
              const timeAgo = formatDistanceToNow(new Date(item.timestamp * 1000), {
                addSuffix: true,
              });
              const scoreColor =
                item.score >= 70
                  ? "bg-accent-green/20 text-accent-green"
                  : "bg-destructive/20 text-destructive";

              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between gap-6 rounded-lg border border-border bg-card p-5"
                  )}
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
                      <a
                        href={explorerHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground hover:underline"
                      >
                        {truncateAddress(item.address)}
                      </a>
                      <span>•</span>
                      <span>{timeAgo}</span>
                    </div>
                    {item.comment && (
                      <p className="text-sm text-foreground font-normal">
                        {item.comment}
                      </p>
                    )}
                    <a
                      href={explorerHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:underline font-mono"
                    >
                      View on Explorer
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div
                    className={`flex shrink-0 flex-col items-center justify-center rounded-lg px-4 py-2 ${scoreColor}`}
                  >
                    <span className="text-xl font-bold">{item.score}</span>
                    <span className="text-xs font-medium opacity-80">/100</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">
              Showing {start + 1}-{end} of {total}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
