"use client";

import { BarChart3, MessageSquare, Star, Bot, Check, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import type { AgentData } from "@/lib/agent-data";

export function AgentMainContent({ agent }: { agent: AgentData }) {
  const { metadata } = agent;
  const services = metadata.services ?? metadata.endpoints ?? [];
  const tags = metadata.tags ?? [];
  const description = metadata.description ?? "";

  const capabilities: string[] = [];
  for (const s of services) {
    if (s.name?.toLowerCase() === "mcp") {
      const raw = s as { mcpTools?: string[]; mcpPrompts?: string[]; mcpResources?: string[] };
      if (raw.mcpTools?.length) capabilities.push("tools");
      if (raw.mcpPrompts?.length) capabilities.push("prompts");
      if (raw.mcpResources?.length) capabilities.push("resources");
    }
  }
  const capSet = new Set(capabilities);
  if (capSet.size === 0) capSet.add("tools").add("resources").add("prompts");

  return (
    <div className="space-y-6">
      {/* 1. Statistics Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">Statistics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-primary/10 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-current text-accent-green" />
                Average Score
              </div>
              <div className="mt-1 text-xl font-bold text-accent-green">—/5.0</div>
              <div className="text-xs text-muted-foreground">(0/100)</div>
            </div>
            <div className="rounded-lg bg-destructive/10 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                Total Feedback
              </div>
              <div className="mt-1 text-xl font-bold">0</div>
            </div>
            <div className="rounded-lg bg-accent-green/10 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                Overall Score
              </div>
              <div className="mt-1 text-xl font-bold text-accent-green">—</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Agent Endpoints (merged Services + Agent Endpoints) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Agent Endpoints</CardTitle>
          </div>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
            {services.length} configured
          </span>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Agent communication services.
          </p>
          {services.length === 0 ? (
            <p className="text-sm text-muted-foreground">No endpoints configured.</p>
          ) : (
            <div className="space-y-2">
              {services.map((svc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{svc.name ?? "Unknown"}</span>
                      {svc.version && (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {svc.version}
                        </span>
                      )}
                    </div>
                    {svc.endpoint && (
                      <code className="mt-1 block truncate text-xs text-muted-foreground">
                        {svc.endpoint}
                      </code>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {svc.endpoint && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            navigator.clipboard?.writeText(svc.endpoint!)
                          }
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        {svc.endpoint.startsWith("http") && (
                          <a
                            href={svc.endpoint}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </Button>
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Feedback */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Feedback</CardTitle>
          <Button variant="link" size="sm" className="h-auto p-0">
            View all (0)
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No feedback yet. Connect wallet to leave feedback.
          </p>
        </CardContent>
      </Card>

      {/* 4. Description */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          {description ? (
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No description provided.
            </p>
          )}
        </CardContent>
      </Card>

      {/* 5. Capabilities + Tags (side-by-side on desktop) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Capabilities</CardTitle>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
              {capSet.size}
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from(capSet).map((cap) => (
                <span
                  key={cap}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                >
                  <Check className="h-3 w-3 text-primary" />
                  {cap}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Tags</CardTitle>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
              {tags.length}
            </span>
          </CardHeader>
          <CardContent>
            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tags assigned</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 6. Recent Validations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Recent Validations</CardTitle>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">0</span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <Shield className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No validations yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
