"use client";

import { useState } from "react";
import { ChevronDown, MessageSquare } from "lucide-react";
import { PublicSitePanel } from "@/components/public-site/public-site-ui";
import {
  agentTalkUnavailableMessage,
  type AgentTalkTarget,
} from "@/lib/public-site/agent-talk-target";
import { resolveOrSynthesizeDemoAgent } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

type ChatMessage = {
  readonly id: string;
  readonly role: "user" | "assistant";
  readonly content: string;
};

type Props = {
  readonly chainId: number;
  readonly agentId: number;
  readonly talk: AgentTalkTarget;
};

function generateDemoAgentReply(chainId: number, agentId: number, prompt: string): string {
  const agent = resolveOrSynthesizeDemoAgent(chainId, agentId);
  const skills = agent.capabilities.map((c) => c.label).slice(0, 3).join(", ") || "autonomous reasoning";
  const tokenNote =
    agent.linkedTokens[0]?.symbol
      ? ` My linked token $${agent.linkedTokens[0].symbol} is actively tracked across liquidity venues.`
      : "";
  const lower = prompt.toLowerCase();
  if (lower.includes("skill") || lower.includes("capabilit") || lower.includes("what can you do")) {
    return `I am ${agent.name} (Agent #${agentId} on ${agent.chain.name}). My active capabilities include ${skills}. I expose MCP and A2A endpoints anchored on-chain via ERC-8004.${tokenNote}`;
  }
  if (lower.includes("token") || lower.includes("price") || lower.includes("market")) {
    return `${agent.name} telemetry report:${tokenNote || " No token is currently bound to this agent, though you can launch one via the AgentRanking Token Launchpad (/launch)."} My current AgentRanking score is ${agent.nativeScore.total}/100.`;
  }
  return `[${agent.name} · ${agent.chain.shortName} #${agentId}] Received: "${prompt}". Operating with verified ${skills} pipelines (Trust Score ${agent.nativeScore.total}/100). Ready for MCP tool invocation or A2A task dispatch.${tokenNote}`;
}

export function AgentTalkPanel({ chainId, agentId, talk }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSend = talk.status === "live" && !pending;

  async function handleSend(event?: React.FormEvent) {
    event?.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !canSend) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setPending(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 420));
    const reply = generateDemoAgentReply(chainId, agentId, trimmed);
    setMessages((current) => [
      ...current,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: reply,
      },
    ]);
    setPending(false);
  }

  const unavailableMessage =
    talk.status === "unavailable"
      ? agentTalkUnavailableMessage(talk.reason)
      : null;

  function handleToggle(event: React.ToggleEvent<HTMLDetailsElement>) {
    if (!event.currentTarget.open || talk.status !== "live") return;
    requestAnimationFrame(() => {
      document.getElementById("agent-talk-input")?.focus();
    });
  }

  return (
    <PublicSitePanel>
      <details id="talk-panel" className="group" onToggle={handleToggle}>
        <summary className="cursor-pointer list-none rounded-md [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Talk
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-foreground/80">
              Talk to this agent
              <ChevronDown
                className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              />
            </span>
          </span>
        </summary>

        <div className="mt-4 space-y-4">
          <div className="min-h-[160px] rounded-xl border border-border/60 bg-muted/10 p-4">
            {messages.length === 0 ? (
              <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 text-center">
                <p className="text-sm text-muted-foreground">
                  {talk.status === "live"
                    ? "Start a conversation with this agent."
                    : "This agent does not expose a live talk endpoint yet."}
                </p>
                {talk.status === "live" ? null : (
                  <p className="max-w-sm text-xs text-muted-foreground">{unavailableMessage}</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                      message.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "border border-border/60 bg-card/70 text-foreground",
                    )}
                  >
                    {message.content}
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="space-y-2">
            <div className="flex gap-2">
              <input
                id="agent-talk-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={
                  talk.status === "live"
                    ? "Ask the agent anything..."
                    : "Talk unavailable for this agent"
                }
                disabled={!canSend}
                maxLength={2000}
                className="ui-input flex-1"
              />
              <button
                type="submit"
                disabled={!canSend || draft.trim().length === 0}
                className="ui-btn ui-btn-primary ui-btn-sm"
              >
                {pending ? "Sending..." : "Send"}
              </button>
            </div>
            {error ? <p className="text-xs text-muted-foreground">{error}</p> : null}
            {messages.length > 0 ? (
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setMessages([]);
                  setError(null);
                }}
              >
                Clear chat
              </button>
            ) : null}
            <p className="text-[11px] text-muted-foreground">
              Messages go to the agent&apos;s declared HTTPS endpoint when our last health check marked it live.
            </p>
          </form>
        </div>
      </details>
    </PublicSitePanel>
  );
}
