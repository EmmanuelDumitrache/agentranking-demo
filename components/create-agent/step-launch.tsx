"use client";

import { useEffect, useState } from "react";
import { useCreateAgent } from "@/contexts/create-agent-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Globe, Tag, Settings, Rocket, Wallet, Sparkles } from "lucide-react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRegisterAgent, IDENTITY_REGISTRY_ADDRESS, SEPOLIA_CHAIN_ID } from "@/lib/erc8004-registry";
import { useRouter } from "next/navigation";
import { useCreatedAgentsStore } from "@/stores/created-agents-store";

export function StepLaunch() {
  const { state, buildMetadata, getAgentUri, fillSampleAgent } = useCreateAgent();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { register, isPending, isSuccess, data } = useRegisterAgent();
  const createdAgents = useCreatedAgentsStore((s) => s.agents);
  const addCreatedAgent = useCreatedAgentsStore((s) => s.addAgent);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const metadata = buildMetadata();
  const metadataJson = JSON.stringify(metadata, null, 2);

  useEffect(() => {
    if (isSuccess && data?.agentId != null) {
      const uri = getAgentUri(data.agentId, IDENTITY_REGISTRY_ADDRESS);
      addCreatedAgent({
        agentId: data.agentId,
        chainId: SEPOLIA_CHAIN_ID,
        chainName: "Sepolia",
        registry: IDENTITY_REGISTRY_ADDRESS,
        name: state.name.trim() || `Agent #${data.agentId}`,
        description: state.description.trim(),
        image: state.imageUrl.trim(),
        endpoint: state.services[0]?.endpoint || "",
        services: state.services,
        tags: state.tags,
        skills: state.skills,
        domains: state.domains,
        supportedTrust: state.supportedTrust,
        active: state.active,
        x402Support: state.x402Support,
        featured: state.advertiseOptions.featureOnHomepage,
        agentURI: uri,
        createdAt: Date.now(),
      });
      router.push(`/agent/${data.agentId}`);
    }
  }, [isSuccess, data?.agentId, addCreatedAgent, router, state, getAgentUri]);

  const handleDemoLaunch = () => {
    setError(null);
    setIsSimulating(true);

    const maxExistingId = createdAgents.reduce(
      (max, a) => Math.max(max, a.agentId),
      50
    );
    const nextAgentId = maxExistingId + 1;
    const agentName = state.name.trim() || `DemoAgent #${nextAgentId}`;
    const uri = getAgentUri(nextAgentId, IDENTITY_REGISTRY_ADDRESS);

    addCreatedAgent({
      agentId: nextAgentId,
      chainId: SEPOLIA_CHAIN_ID,
      chainName: "Sepolia",
      registry: IDENTITY_REGISTRY_ADDRESS,
      name: agentName,
      description:
        state.description.trim() ||
        `${agentName} is an ERC-8004 autonomous agent deployed via the 8004scanner launchpad.`,
      image:
        state.imageUrl.trim() ||
        `https://api.dicebear.com/7.x/shapes/svg?seed=custom-${nextAgentId}`,
      endpoint:
        state.services[0]?.endpoint ||
        `https://agent-${nextAgentId}.8004scanner.ai/mcp`,
      services:
        state.services.length > 0
          ? state.services
          : [
              {
                id: "default-mcp",
                name: "MCP",
                endpoint: `https://agent-${nextAgentId}.8004scanner.ai/mcp`,
                version: "2025-06-18",
              },
            ],
      tags: state.tags.length > 0 ? state.tags : ["defi", "mcp", "erc-8004"],
      skills: state.skills.length > 0 ? state.skills : ["Analytics", "Monitoring"],
      domains: state.domains.length > 0 ? state.domains : ["DeFi", "Analytics"],
      supportedTrust:
        state.supportedTrust.length > 0
          ? state.supportedTrust
          : ["reputation", "crypto-economic"],
      active: state.active,
      x402Support: state.x402Support,
      featured: state.advertiseOptions.featureOnHomepage,
      agentURI: uri,
      createdAt: Date.now(),
    });

    router.push(`/agent/${nextAgentId}`);
  };

  const handleOnChainLaunch = () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    setError(null);
    try {
      const uri = getAgentUri();
      register(uri);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const primaryEndpoint =
    state.services.find((s) => s.name === "web")?.endpoint ||
    state.services[0]?.endpoint ||
    "Auto-assigned on launch";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review &amp; Launch Agent</CardTitle>
          <p className="text-sm text-muted-foreground">
            Review your ERC-8004 agent configuration and launch immediately in Demo Mode or via Sepolia wallet.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!state.name.trim() && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
              <div className="text-sm text-yellow-400">
                You haven&apos;t entered an agent name yet. Want to prefill a complete sample agent?
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={fillSampleAgent}
                className="gap-1.5 border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Prefill Demo Agent
              </Button>
            </div>
          )}

          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-primary font-medium">
              <Globe className="h-5 w-5" />
              ERC-8004 Identity Registry (Sepolia)
            </div>
            <p className="text-sm text-muted-foreground mt-1 font-mono break-all">
              Contract: {IDENTITY_REGISTRY_ADDRESS}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" />
                  Basic Info
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  {state.name || "Auto-named on launch"}
                </p>
                <p className="mt-1 line-clamp-2">
                  <span className="text-muted-foreground">Description:</span>{" "}
                  {state.description || "Default ERC-8004 description"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="h-4 w-4" />
                  Endpoints ({state.services.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="truncate">{primaryEndpoint}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Tag className="h-4 w-4" />
                  Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {state.tags.length + state.skills.length + state.domains.length >
                0 ? (
                  <p>
                    {state.tags.length} tags, {state.skills.length} skills,{" "}
                    {state.domains.length} domains
                  </p>
                ) : (
                  <p className="text-muted-foreground">Default DeFi &amp; MCP tags</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-4 w-4" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <span
                  className={
                    state.active ? "text-primary" : "text-muted-foreground"
                  }
                >
                  ● {state.active ? "Active" : "Inactive"}
                </span>
                {state.x402Support && (
                  <p className="mt-1 text-muted-foreground">x402 payment supported</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Generated ERC-8004 Metadata</h4>
            <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto max-h-48 overflow-y-auto">
              {metadataJson}
            </pre>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 text-destructive p-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              type="button"
              size="lg"
              onClick={handleDemoLaunch}
              disabled={isSimulating || isPending}
              className="gap-2"
            >
              <Rocket className="h-4 w-4" />
              {isSimulating ? "Launching Agent..." : "Launch Agent (Instant Demo)"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleOnChainLaunch}
              disabled={isPending || isSimulating}
              className="gap-2"
            >
              <Wallet className="h-4 w-4" />
              {!isConnected
                ? "Connect Wallet for On-Chain Deploy"
                : isPending
                  ? "Deploying to Sepolia..."
                  : "Deploy On-Chain (Sepolia)"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
