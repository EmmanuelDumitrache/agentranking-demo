"use client";

import { useCreateAgent } from "@/contexts/create-agent-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function StepAdvertise() {
  const { state, setField } = useCreateAgent();
  const [copied, setCopied] = useState<string | null>(null);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://8004scanner.com";

  const agentUrl = `${baseUrl}/agent/1`; // Placeholder - will be updated after launch

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const twitterShare = `Check out my new ERC-8004 agent on 8004scanner: ${agentUrl}`;
  const discordShare = `**My ERC-8004 Agent**\n${agentUrl}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advertise</CardTitle>
        <p className="text-sm text-muted-foreground">
          Promote your agent on 8004scanner and share it with the community.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Checkbox
              id="submit-discovery"
              checked={state.advertiseOptions.submitToDiscovery}
              onCheckedChange={(v) =>
                setField("advertiseOptions", {
                  ...state.advertiseOptions,
                  submitToDiscovery: !!v,
                })
              }
            />
            <div>
              <Label htmlFor="submit-discovery" className="font-medium cursor-pointer">
                Submit to 8004scanner discovery
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Your agent will appear in the 8004scanner discovery feed after
                launch so users can find and interact with it.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Checkbox
              id="feature-homepage"
              checked={state.advertiseOptions.featureOnHomepage}
              onCheckedChange={(v) =>
                setField("advertiseOptions", {
                  ...state.advertiseOptions,
                  featureOnHomepage: !!v,
                })
              }
            />
            <div>
              <Label htmlFor="feature-homepage" className="font-medium cursor-pointer">
                Feature on homepage
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Request your agent to be featured on the 8004scanner homepage
                (subject to curation).
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Share links</Label>
          <p className="text-sm text-muted-foreground">
            After launch, use these links to share your agent. The agent URL will
            be available on the Launch step.
          </p>
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate text-sm text-muted-foreground">
                {agentUrl}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => copyToClipboard(agentUrl, "url")}
              >
                {copied === "url" ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Twitter: {twitterShare}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(twitterShare, "twitter")}
              >
                {copied === "twitter" ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                Copy Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(discordShare, "discord")}
              >
                {copied === "discord" ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                Copy Discord
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
