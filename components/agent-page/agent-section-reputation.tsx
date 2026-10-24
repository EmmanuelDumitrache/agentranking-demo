"use client";

import { Star, MessageSquare, TrendingUp, CheckCircle2, AlertCircle, Tag, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatReputation } from "@/lib/utils";
import type { AgentData } from "@/lib/agent-data";
import { getDeterministicAgentMetrics, generateMockReputationEvents } from "@/lib/mock-data";
import { useCreatedAgentsStore } from "@/stores/created-agents-store";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";

const DAY_LABELS = ["6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "Yesterday", "Today"];

export function ReputationSection({ agent }: { agent: AgentData }) {
  const { agentId } = agent;
  const createdAgents = useCreatedAgentsStore((s) => s.agents);
  const userFeedback = useCreatedAgentsStore((s) => s.feedbackByAgent[agentId] ?? []);
  const isCustom = createdAgents.some((a) => Number(a.agentId) === Number(agentId));

  const metrics = getDeterministicAgentMetrics(agentId);
  const reputationScore = isCustom ? 94.2 : metrics.reputation;
  const feedbackCount = (isCustom ? 12 : metrics.feedbackCount) + userFeedback.length;
  const events = generateMockReputationEvents(agentId, 6);

  const chartData = DAY_LABELS.map((day, idx) => ({
    day,
    reputation: isCustom ? [88.0, 89.2, 90.5, 91.1, 92.4, 93.6, 94.2][idx] : metrics.repHistory[idx],
    volume: isCustom ? [420, 580, 710, 890, 960, 1120, 1240][idx] : metrics.volumeHistory[idx],
  }));

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Star className="h-4 w-4 text-accent-green" />
            Reputation &amp; Call Volume (7-Day Trend)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-primary/10 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-current text-accent-green" />
                Overall Reputation
              </div>
              <div className="mt-1 text-2xl font-bold text-accent-green">
                {formatReputation(reputationScore)} / 100
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                24h Call Volume
              </div>
              <div className="mt-1 text-2xl font-bold text-foreground">
                {(isCustom ? 1240 : metrics.callVolume).toLocaleString()} calls
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                Verified Feedback
              </div>
              <div className="mt-1 text-2xl font-bold">{feedbackCount}</div>
            </div>
          </div>

          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis
                  yAxisId="left"
                  domain={[50, 100]}
                  stroke="#00d4aa"
                  fontSize={12}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6C63FF"
                  fontSize={12}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#1a1f2e",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  yAxisId="right"
                  dataKey="volume"
                  name="Call Volume"
                  fill="#6C63FF"
                  fillOpacity={0.35}
                  radius={[4, 4, 0, 0]}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="reputation"
                  name="Reputation Score"
                  stroke="#00d4aa"
                  strokeWidth={2.5}
                  fill="#00d4aa"
                  fillOpacity={0.15}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reputation Event Timeline</CardTitle>
          <p className="text-sm text-muted-foreground">
            On-chain and validator-attested events contributing to this agent&apos;s reputation score.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((ev) => {
              const isPos = ev.score >= 0;
              return (
                <div
                  key={ev.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/20 p-4"
                >
                  <div className="flex items-start gap-3">
                    {ev.type === "verified" ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
                    ) : ev.type === "downtime" ? (
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-red" />
                    ) : ev.type === "fee_change" ? (
                      <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <Tag className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {ev.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(ev.timestamp).toLocaleDateString()} ·ERC-8004 Telemetry
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                      isPos
                        ? "bg-accent-green/15 text-accent-green"
                        : "bg-accent-red/15 text-accent-red"
                    }`}
                  >
                    {isPos ? `+${ev.score}` : ev.score} pts
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
