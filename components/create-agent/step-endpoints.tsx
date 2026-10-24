"use client";

import { useState } from "react";
import { useCreateAgent } from "@/contexts/create-agent-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Mail,
  Box,
  Link2,
  FileCode,
  Globe as GlobeIcon,
  Shield,
  Wallet,
  Settings,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ENDPOINT_TYPES = [
  { key: "web", label: "Web", icon: Globe },
  { key: "email", label: "Email", icon: Mail },
  { key: "MCP", label: "MCP", icon: Box },
  { key: "A2A", label: "A2A", icon: Link2 },
  { key: "OASF", label: "OASF", icon: FileCode },
  { key: "ENS", label: "ENS", icon: GlobeIcon },
  { key: "DID", label: "DID", icon: Shield },
  { key: "wallet", label: "Wallet", icon: Wallet },
  { key: "custom", label: "Custom", icon: Settings },
] as const;

const PLACEHOLDERS: Record<string, string> = {
  web: "https://web.myagent.com",
  email: "support@myagent.com",
  MCP: "https://mcp.myagent.com/",
  A2A: "https://agent.example/.well-known/agent-card.json",
  OASF: "ipfs://... or https://...",
  ENS: "myagent.eth",
  DID: "did:ethr:0x...",
  wallet: "eip155:1:0x...",
  custom: "https://...",
};

export function StepEndpoints() {
  const { state, setFieldPartial } = useCreateAgent();
  const [activeTab, setActiveTab] = useState("web");
  const [webUrl, setWebUrl] = useState("");
  const [emailAddr, setEmailAddr] = useState("");
  const [mcpUrl, setMcpUrl] = useState("");
  const [a2aUrl, setA2aUrl] = useState("");
  const [oasfUrl, setOasfUrl] = useState("");
  const [ensName, setEnsName] = useState("");
  const [didValue, setDidValue] = useState("");
  const [walletAddr, setWalletAddr] = useState("");
  const [customName, setCustomName] = useState("");
  const [customEndpoint, setCustomEndpoint] = useState("");

  const addEndpoint = (name: string, endpoint: string, version?: string) => {
    if (!endpoint.trim()) return;
    const id = crypto.randomUUID();
    setFieldPartial("services", (prev) => [
      ...prev,
      { id, name, endpoint: endpoint.trim(), version },
    ]);
    if (name === "web") setWebUrl("");
    if (name === "email") setEmailAddr("");
    if (name === "MCP") setMcpUrl("");
    if (name === "A2A") setA2aUrl("");
    if (name === "OASF") setOasfUrl("");
    if (name === "ENS") setEnsName("");
    if (name === "DID") setDidValue("");
    if (name === "wallet") setWalletAddr("");
    if (name === "custom") {
      setCustomName("");
      setCustomEndpoint("");
    }
  };

  const removeEndpoint = (id: string) => {
    setFieldPartial("services", (prev) => prev.filter((s) => s.id !== id));
  };

  const renderAddForm = () => {
    switch (activeTab) {
      case "web":
        return (
          <div className="space-y-2">
            <Label>Public website or web interface for your agent</Label>
            <div className="flex gap-2">
              <Input
                placeholder={PLACEHOLDERS.web}
                value={webUrl}
                onChange={(e) => setWebUrl(e.target.value)}
              />
              <Button
                onClick={() => addEndpoint("web", webUrl)}
                disabled={!webUrl.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Endpoint
              </Button>
            </div>
          </div>
        );
      case "email":
        return (
          <div className="space-y-2">
            <Label>Contact email for your agent</Label>
            <div className="flex gap-2">
              <Input
                placeholder={PLACEHOLDERS.email}
                value={emailAddr}
                onChange={(e) => setEmailAddr(e.target.value)}
              />
              <Button
                onClick={() => addEndpoint("email", emailAddr)}
                disabled={!emailAddr.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Endpoint
              </Button>
            </div>
          </div>
        );
      case "MCP":
        return (
          <div className="space-y-2">
            <Label>MCP server URL</Label>
            <div className="flex gap-2">
              <Input
                placeholder={PLACEHOLDERS.MCP}
                value={mcpUrl}
                onChange={(e) => setMcpUrl(e.target.value)}
              />
              <Button
                onClick={() =>
                  addEndpoint("MCP", mcpUrl, "2025-06-18")
                }
                disabled={!mcpUrl.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Endpoint
              </Button>
            </div>
          </div>
        );
      case "A2A":
        return (
          <div className="space-y-2">
            <Label>A2A agent card URL</Label>
            <div className="flex gap-2">
              <Input
                placeholder={PLACEHOLDERS.A2A}
                value={a2aUrl}
                onChange={(e) => setA2aUrl(e.target.value)}
              />
              <Button
                onClick={() => addEndpoint("A2A", a2aUrl, "0.3.0")}
                disabled={!a2aUrl.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Endpoint
              </Button>
            </div>
          </div>
        );
      case "OASF":
        return (
          <div className="space-y-2">
            <Label>OASF manifest URL (IPFS or HTTPS)</Label>
            <div className="flex gap-2">
              <Input
                placeholder={PLACEHOLDERS.OASF}
                value={oasfUrl}
                onChange={(e) => setOasfUrl(e.target.value)}
              />
              <Button
                onClick={() => addEndpoint("OASF", oasfUrl, "0.8.0")}
                disabled={!oasfUrl.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Endpoint
              </Button>
            </div>
          </div>
        );
      case "ENS":
        return (
          <div className="space-y-2">
            <Label>ENS name</Label>
            <div className="flex gap-2">
              <Input
                placeholder={PLACEHOLDERS.ENS}
                value={ensName}
                onChange={(e) => setEnsName(e.target.value)}
              />
              <Button
                onClick={() => addEndpoint("ENS", ensName, "v1")}
                disabled={!ensName.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Endpoint
              </Button>
            </div>
          </div>
        );
      case "DID":
        return (
          <div className="space-y-2">
            <Label>DID identifier</Label>
            <div className="flex gap-2">
              <Input
                placeholder={PLACEHOLDERS.DID}
                value={didValue}
                onChange={(e) => setDidValue(e.target.value)}
              />
              <Button
                onClick={() => addEndpoint("DID", didValue, "v1")}
                disabled={!didValue.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Endpoint
              </Button>
            </div>
          </div>
        );
      case "wallet":
        return (
          <div className="space-y-2">
            <Label>Agent wallet (CAIP-10 format)</Label>
            <div className="flex gap-2">
              <Input
                placeholder={PLACEHOLDERS.wallet}
                value={walletAddr}
                onChange={(e) => setWalletAddr(e.target.value)}
              />
              <Button
                onClick={() => addEndpoint("agentWallet", walletAddr)}
                disabled={!walletAddr.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Endpoint
              </Button>
            </div>
          </div>
        );
      case "custom":
        return (
          <div className="space-y-2">
            <Label>Custom endpoint name</Label>
            <Input
              placeholder="Endpoint type name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
            <Label>Custom endpoint URL or identifier</Label>
            <div className="flex gap-2">
              <Input
                placeholder={PLACEHOLDERS.custom}
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
              />
              <Button
                onClick={() =>
                  addEndpoint(customName || "custom", customEndpoint)
                }
                disabled={!customEndpoint.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Endpoint
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication Endpoints</CardTitle>
        <p className="text-sm text-muted-foreground">
          Add at least one endpoint so others can communicate with your agent.
          Endpoints define how users and other agents can reach your agent.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-border p-4">
          <h4 className="font-medium mb-3">Add New Endpoint</h4>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
              {ENDPOINT_TYPES.map(({ key, label, icon: Icon }) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeTab} className="mt-4">
              {renderAddForm()}
            </TabsContent>
          </Tabs>
        </div>

        {state.services.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Added Endpoints ({state.services.length})</h4>
            <ul className="space-y-2">
              {state.services.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span className="font-medium">{s.name}:</span>
                  <code className="flex-1 truncate mx-2 text-muted-foreground">
                    {s.endpoint}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => removeEndpoint(s.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          You can skip adding endpoints now and add them later, but it&apos;s
          recommended to add at least one endpoint so others know how to
          communicate with your agent.
        </p>
      </CardContent>
    </Card>
  );
}
