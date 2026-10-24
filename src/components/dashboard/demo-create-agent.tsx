"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  Coins,
  Copy,
  FileUp,
  ImagePlus,
  Loader2,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { AgentAvatar } from "@/components/shared/agent-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast-simple";
import { cn } from "@/lib/utils";
import {
  getAllDemoAgents,
  saveCustomDemoAgentToStorage,
  type DemoSeedAgent,
} from "@/lib/demo-store";
import { toAgentUrlSlug } from "@/lib/agent-public-url";

const STEPS = [
  { id: "profile", title: "Agent profile", hint: "Name your agent and describe what it does." },
  { id: "branding", title: "Avatar & branding", hint: "Upload an image or generate a themed robot avatar with AI." },
  { id: "links", title: "Links & proof", hint: "Optional social links and proof of ownership." },
  { id: "token", title: "Deployment choice", hint: "Create the agent only or jump to token launch." },
  { id: "review", title: "Review & create", hint: "Confirm everything before your agent goes live." },
] as const;

type WizardStepId = (typeof STEPS)[number]["id"];

type WizardState = {
  name: string;
  description: string;
  persona: string;
  tags: string;
  image: string;
  website: string;
  twitter: string;
  telegram: string;
  github: string;
};

const INITIAL_WIZARD: WizardState = {
  name: "",
  description: "",
  persona: "",
  tags: "",
  image: "",
  website: "",
  twitter: "",
  telegram: "",
  github: "",
};

const DEMO_AVATARS = [
  "/ar-mark-square.png",
  "/ar-mark.png",
  "/ar-mark-3d.png",
  "/brandkit/avatars/ar-avatar-01.png",
  "/brandkit/avatars/ar-avatar-02.png",
  "/brandkit/avatars/ar-avatar-03.png",
];

const SAMPLE_MIGRATION_JSON = JSON.stringify(
  {
    schema: "agentranking_agent_export",
    agent: {
      name: "Shibuya Quant Sentinel",
      summary:
        "Autonomous Tokyo session perp & spot arbitrage agent with verified ERC-8004 identity and Claude MCP tool server.",
      persona:
        "Institutional quant strategist focused on Asia-Pacific crypto liquidity, JPY/USDC basis, and low-latency execution.",
      model: "claude-3-7-sonnet",
      temperature: 0.3,
      enabled_skills: ["MCP Tool Server", "x402 Micropayments", "Perp Basis Arb", "ERC-8004 Identity"],
    },
    source: {
      platform: "ElizaOS v2",
      agent_name: "shibuya-quant-v2",
      notes: "Migrated from local ElizaOS runtime",
    },
  },
  null,
  2,
);

const MIGRATION_PROMPT = `Export your current agent configuration as strict JSON with schema "agentranking_agent_export":
{
  "schema": "agentranking_agent_export",
  "agent": {
    "name": "<Agent Name>",
    "summary": "<1-2 sentence description>",
    "persona": "<System prompt or persona>",
    "model": "claude-3-7-sonnet",
    "temperature": 0.4,
    "enabled_skills": ["MCP", "x402", "DeFi"]
  },
  "source": {
    "platform": "ElizaOS / Custom",
    "agent_name": "<Original handle>"
  }
}
Do NOT include any API keys, private keys, or secrets.`;

function buildAndPersistDemoAgent(input: {
  name: string;
  description: string;
  persona?: string;
  tags: string[];
  image?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  github?: string;
}): DemoSeedAgent {
  const existing = getAllDemoAgents();
  const maxId = existing.reduce((acc, a) => Math.max(acc, a.id, a.agentId), 112);
  const nextId = maxId + 1;
  const slug = toAgentUrlSlug(input.name);
  const sym =
    (input.tags[0] || input.name)
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 6)
      .toUpperCase() || "AGENT";

  const newAgent: DemoSeedAgent = {
    id: nextId,
    agentId: nextId,
    chainId: 8453,
    name: input.name.trim(),
    description:
      input.description.trim() ||
      input.persona?.trim() ||
      "Autonomous AI agent created in the AgentRanking creator studio with ERC-8004 identity and MCP tool support.",
    image: input.image?.trim() || "/ar-mark-square.png",
    category: input.tags[0] || "Autonomous Agent",
    archetype: "autonomous_creator",
    agentMode: "autonomous",
    score: 91.4,
    isVerified: true,
    isPremiumVerified: true,
    verificationTier: "INDIVIDUAL",
    x402Support: true,
    mppSupport: true,
    mcpSupport: true,
    sapVerified: true,
    owner: "0x71C95911E9a5D330f4D621842EC243EE1343292e",
    agentWallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    socials: {
      website: input.website?.trim() || `https://${slug}.agentranking.demo`,
      twitter: input.twitter?.trim() || "https://x.com/agentranking",
      telegram: input.telegram?.trim() || null,
      github: input.github?.trim() || "https://github.com/EmmanuelDumitrache/agentranking-demo",
    },
    capabilities:
      input.tags.length > 0
        ? input.tags
        : ["ERC-8004 Identity", "MCP Tool Server", "x402 Micropayments"],
    services: [
      {
        name: "MCP",
        endpoint: `https://mcp.agentranking.io/agents/${slug}/mcp`,
        version: "2025-06-18",
      },
      {
        name: "A2A",
        endpoint: `https://api.agentranking.io/agents/${slug}/a2a`,
        version: "1.0.0",
      },
    ],
    token: {
      mint: `${sym}7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZpump`,
      name: input.name.trim(),
      symbol: sym,
      chain: "solana",
      venue: "Metaplex",
      priceUsd: 0.042,
      marketCapUsd: 4_200_000,
      volume24hUsd: 680_000,
      liquidityUsd: 390_000,
      priceChange24hPct: 19.5,
      buys24h: 410,
      sells24h: 220,
    },
  };

  saveCustomDemoAgentToStorage(newAgent);
  try {
    window.localStorage.setItem("ar-dashboard-last-agent-id", String(newAgent.id));
  } catch {
    // Ignore
  }
  return newAgent;
}

export function DemoCreateAgentWizard({
  onBackToEntry,
}: {
  readonly onBackToEntry?: () => void;
}) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<WizardState>(INITIAL_WIZARD);
  const [deploymentChoice, setDeploymentChoice] = useState<"agent" | "token" | null>("agent");
  const [generatingAvatar, setGeneratingAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const step = STEPS[stepIndex]!;
  const progress = ((stepIndex + 1) / STEPS.length) * 100;
  const tagList = useMemo(
    () =>
      form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [form.tags],
  );

  const update = <K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canAdvance = (): boolean => {
    if (step.id === "profile") {
      return form.name.trim().length >= 2;
    }
    if (step.id === "token") {
      return deploymentChoice !== null;
    }
    return true;
  };

  const handleGenerateAvatar = useCallback(() => {
    setGeneratingAvatar(true);
    setTimeout(() => {
      const pick = DEMO_AVATARS[Math.floor(Math.random() * DEMO_AVATARS.length)]!;
      update("image", pick);
      setGeneratingAvatar(false);
      showToast("AI robot avatar generated", "success");
    }, 450);
  }, []);

  const handlePickFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        update("image", reader.result);
        showToast("Avatar image loaded", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    setLoading(true);
    const created = buildAndPersistDemoAgent({
      name: form.name,
      description: form.description,
      persona: form.persona,
      tags: tagList,
      image: form.image,
      website: form.website,
      twitter: form.twitter,
      telegram: form.telegram,
      github: form.github,
    });
    showToast(`${created.name} created and added to your workspace!`, "success");
    if (deploymentChoice === "token") {
      router.push(`/dashboard/agents/${created.id}/launchpad`);
    } else {
      router.push(`/dashboard/agents/${created.id}`);
    }
  };

  const handleQuickFillAndCreate = () => {
    const created = buildAndPersistDemoAgent({
      name: form.name.trim() || "Tokyo DeFi Copilot",
      description:
        form.description.trim() ||
        "Autonomous ERC-8004 multi-chain DeFi & MCP execution agent with verified x402 endpoints.",
      persona: "Institutional bilingual EN/JP crypto analyst and execution copilot.",
      tags: ["DeFi Execution", "MCP Tool Server", "x402 Micropayments"],
      image: "/ar-mark-square.png",
    });
    showToast(`${created.name} launched! Opening agent overview…`, "success");
    router.push(`/dashboard/agents/${created.id}`);
  };

  return (
    <div className="ui-onboarding-youtube ui-create-agent-page ui-dashboard-overview mx-auto w-full max-w-3xl space-y-4 px-4 py-6 text-[#f1f1f1] sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {onBackToEntry ? (
          <button
            type="button"
            onClick={onBackToEntry}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#aaa] transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            Back to choices
          </button>
        ) : (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#aaa] transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            Back to Dashboard
          </Link>
        )}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleQuickFillAndCreate}
            className="rounded-full border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-200 hover:bg-emerald-500/20"
          >
            <Sparkles className="mr-1.5 size-3.5 text-emerald-400" />
            1-Click Demo Create
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-xs text-[#aaa]">
            <Link href="/create">Advanced ERC-8004 Contract Builder →</Link>
          </Button>
        </div>
      </div>

      <div className="ui-overview-summary overflow-hidden rounded-xl">
        <div className="ui-overview-identity px-4 py-3.5 sm:px-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[#8f8f8f]">
            Step {stepIndex + 1} of {STEPS.length}
          </p>
          <h1 className="mt-1">{step.title}</h1>
          <p className="mt-1 text-sm text-[#aaa]">{step.hint}</p>
        </div>
        <div className="h-1 w-full overflow-hidden bg-[#272727]">
          <div
            className="h-full rounded-full bg-[#f1f1f1] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="ui-onboarding-youtube__panel ui-overview-panel space-y-5 rounded-xl p-4 sm:p-5">
        {step.id === "profile" ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="name">Agent name *</Label>
                <span className="text-[11px] tabular-nums text-[#8f8f8f]">
                  {form.name.length}/80
                </span>
              </div>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                maxLength={80}
                placeholder="Nova AI"
                autoFocus
              />
              <p className="text-xs text-[#aaa]">
                Pick a memorable name — this appears in the sidebar and public profile.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Short description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                placeholder="What does this agent do?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="persona">Persona / goals</Label>
              <Textarea
                id="persona"
                value={form.persona}
                onChange={(e) => update("persona", e.target.value)}
                rows={3}
                placeholder="Tone, audience, and what success looks like for this agent."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Category / tags</Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => update("tags", e.target.value)}
                placeholder="trading, research, mcp"
              />
            </div>
          </div>
        ) : null}

        {step.id === "branding" ? (
          <div className="space-y-5">
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#303030] bg-[#0f0f0f] px-4 py-8 text-center">
              <AgentAvatar
                image={form.image}
                name={form.name || "Agent"}
                size="lg"
                className="!size-20 rounded-2xl"
              />
              <div className="space-y-1">
                <p className="text-sm font-medium">Upload or generate an agent avatar</p>
                <p className="text-xs text-[#aaa]">PNG, JPEG, WebP, or AI robot preset</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="mr-2 size-4" />
                  Choose file
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={generatingAvatar}
                  onClick={handleGenerateAvatar}
                >
                  {generatingAvatar ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 size-4" />
                  )}
                  Generate with AI
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handlePickFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
        ) : null}

        {step.id === "links" ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="twitter">X / Twitter</Label>
                <Input
                  id="twitter"
                  value={form.twitter}
                  onChange={(e) => update("twitter", e.target.value)}
                  placeholder="@handle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  value={form.telegram}
                  onChange={(e) => update("telegram", e.target.value)}
                  placeholder="@handle"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={form.github}
                onChange={(e) => update("github", e.target.value)}
                placeholder="org/repo or username"
              />
            </div>
            <div className="flex gap-3 rounded-xl border border-[#303030] bg-[#0f0f0f] p-4">
              <Wallet className="mt-0.5 size-4 shrink-0 text-[#aaa]" />
              <p className="text-xs leading-relaxed text-[#aaa]">
                A dedicated Solana agent wallet and ERC-8004 identity slot are provisioned
                automatically when you create the agent.
              </p>
            </div>
          </div>
        ) : null}

        {step.id === "token" ? (
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
            <button
              type="button"
              onClick={() => setDeploymentChoice("agent")}
              className={cn(
                "relative cursor-pointer rounded-xl border p-4 text-left transition-all",
                deploymentChoice === "agent"
                  ? "border-[#f1f1f1] bg-[#212121] ring-1 ring-[#f1f1f1]"
                  : "border-[#303030] bg-[#181818] hover:border-[#717171]",
              )}
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#303030] text-[#f1f1f1]">
                  <Bot className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Create agent only</p>
                    {deploymentChoice === "agent" ? <Check className="ml-auto size-4" /> : null}
                  </div>
                  <p className="mt-1 text-sm text-[#aaa]">
                    Land on Overview after creation. Register on chain and launch a token whenever
                    you are ready.
                  </p>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setDeploymentChoice("token")}
              className={cn(
                "relative cursor-pointer rounded-xl border p-4 text-left transition-all",
                deploymentChoice === "token"
                  ? "border-[#f1f1f1] bg-[#212121] ring-1 ring-[#f1f1f1]"
                  : "border-[#303030] bg-[#181818] hover:border-[#717171]",
              )}
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#303030] text-[#f1f1f1]">
                  <Coins className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Agent + prepare token</p>
                    {deploymentChoice === "token" ? <Check className="ml-auto size-4" /> : null}
                  </div>
                  <p className="mt-1 text-sm text-[#aaa]">
                    Go straight to the launchpad with your name, description, and image prefilled.
                  </p>
                </div>
              </div>
            </button>
          </div>
        ) : null}

        {step.id === "review" ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-xl border border-[#303030] bg-[#0f0f0f] p-4">
              <AgentAvatar
                image={form.image}
                name={form.name}
                size="lg"
                className="!size-16 rounded-2xl"
              />
              <div className="min-w-0 space-y-1">
                <p className="text-lg font-semibold">{form.name || "Untitled agent"}</p>
                <p className="text-sm text-[#aaa]">
                  {form.description || "Autonomous ERC-8004 & MCP AI agent."}
                </p>
                {tagList.length > 0 ? (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {tagList.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <dl className="rounded-xl border border-[#303030] bg-[#181818] px-4 py-2 text-sm">
              <div className="flex justify-between border-b border-[#303030] py-2.5">
                <dt className="text-xs uppercase text-[#8f8f8f]">Account Verification</dt>
                <dd className="inline-flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="size-3.5" /> Verified Operator
                </dd>
              </div>
              <div className="flex justify-between border-b border-[#303030] py-2.5">
                <dt className="text-xs uppercase text-[#8f8f8f]">After Create</dt>
                <dd>
                  {deploymentChoice === "token"
                    ? "Open Token Launchpad"
                    : "Open Agent Overview"}
                </dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-xs uppercase text-[#8f8f8f]">Agent Wallet</dt>
                <dd>Provisioned automatically (Solana + Base)</dd>
              </div>
            </dl>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#303030] pt-4">
          <Button type="button" variant="ghost" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <div className="flex gap-2">
            {stepIndex > 0 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStepIndex((i) => i - 1)}
              >
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Button>
            ) : null}
            <Button
              type="button"
              className="rounded-full bg-[#f1f1f1] text-[#0f0f0f] hover:bg-white"
              disabled={!canAdvance() || loading}
              onClick={() => {
                if (stepIndex < STEPS.length - 1) {
                  setStepIndex((i) => i + 1);
                } else {
                  handleCreate();
                }
              }}
            >
              {step.id === "review" ? (
                <>
                  <Check className="mr-2 size-4" />
                  Create agent
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 size-4" />
                  Next
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DemoImportAgentConfig({
  onBackToEntry,
}: {
  readonly onBackToEntry?: () => void;
}) {
  const router = useRouter();
  const [rawJson, setRawJson] = useState("");
  const [parsed, setParsed] = useState<{
    name: string;
    summary: string;
    persona: string;
    skills: string[];
    platform: string;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(MIGRATION_PROMPT);
      setCopiedPrompt(true);
      showToast("Migration prompt copied", "success");
      setTimeout(() => setCopiedPrompt(false), 1800);
    } catch {
      showToast("Could not copy prompt", "error");
    }
  };

  const handleValidate = (inputRaw = rawJson) => {
    try {
      const cleaned = inputRaw
        .replace(/^```json\s*/i, "")
        .replace(/```$/i, "")
        .trim();
      const doc = JSON.parse(cleaned) as {
        schema?: string;
        agent?: {
          name?: string;
          summary?: string;
          persona?: string;
          system_prompt?: string;
          enabled_skills?: string[];
        };
        source?: { platform?: string };
      };
      if (doc.schema !== "agentranking_agent_export" || !doc.agent?.name) {
        setValidationError(
          'JSON must include "schema": "agentranking_agent_export" and "agent.name".',
        );
        setParsed(null);
        return;
      }
      setValidationError(null);
      setParsed({
        name: doc.agent.name,
        summary: doc.agent.summary ?? "",
        persona: doc.agent.persona ?? doc.agent.system_prompt ?? "",
        skills: Array.isArray(doc.agent.enabled_skills) ? doc.agent.enabled_skills : [],
        platform: doc.source?.platform ?? "External Runtime",
      });
      showToast("Migration package validated!", "success");
    } catch {
      setValidationError("Could not parse JSON. Click 'Load sample JSON' to test immediately.");
      setParsed(null);
    }
  };

  const handleCreateImported = () => {
    if (!parsed) return;
    const created = buildAndPersistDemoAgent({
      name: parsed.name,
      description: parsed.summary,
      persona: parsed.persona,
      tags: parsed.skills,
    });
    showToast(`${created.name} imported into your workspace!`, "success");
    router.push(`/dashboard/agents/${created.id}`);
  };

  return (
    <div className="ui-onboarding-youtube ui-create-agent-page ui-dashboard-overview mx-auto w-full max-w-3xl space-y-4 px-4 py-6 text-[#f1f1f1] sm:px-6">
      {onBackToEntry ? (
        <button
          type="button"
          onClick={onBackToEntry}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#aaa] transition-colors hover:text-white"
        >
          <ArrowLeft className="size-3.5" />
          Back to choices
        </button>
      ) : null}

      <div className="ui-overview-summary overflow-hidden rounded-xl">
        <div className="ui-overview-identity px-4 py-3.5 sm:px-5">
          <h1>Import an agent</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Transfer an existing persona using a validated, secret-free JSON package.
          </p>
        </div>
      </div>

      <div className="ui-onboarding-youtube__panel ui-overview-panel overflow-hidden rounded-xl">
        <div className="ui-overview-panel-header flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
          <div>
            <p className="text-sm font-semibold">Generate the migration package</p>
            <p className="mt-1 text-xs text-muted-foreground">
              The prompt excludes secrets and requests only supported fields.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRawJson(SAMPLE_MIGRATION_JSON);
                handleValidate(SAMPLE_MIGRATION_JSON);
              }}
            >
              <Sparkles className="mr-1.5 size-3.5 text-emerald-400" />
              Load sample JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => void handleCopyPrompt()}>
              {copiedPrompt ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copiedPrompt ? "Copied" : "Copy prompt"}
            </Button>
          </div>
        </div>
        <div className="space-y-3 px-4 py-4 sm:px-5">
          <div className="flex items-start gap-2 rounded-lg bg-[#212121] p-3 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
            Credentials, private keys, session data, and secret-bearing fields are rejected before
            import.
          </div>
        </div>
      </div>

      <div className="ui-overview-panel overflow-hidden rounded-xl">
        <div className="ui-overview-panel-header px-4 py-3.5 sm:px-5">
          <p className="text-sm font-semibold">Add the JSON response</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Paste the response or upload a .json file.
          </p>
        </div>
        <div className="space-y-3 px-4 py-4 sm:px-5">
          <textarea
            value={rawJson}
            onChange={(e) => {
              setRawJson(e.target.value);
              setParsed(null);
              setValidationError(null);
            }}
            rows={8}
            placeholder={SAMPLE_MIGRATION_JSON}
            className="w-full resize-y rounded-xl border border-[#303030] bg-[#0f0f0f] px-4 py-3 font-mono text-sm text-[#f1f1f1] placeholder:text-[#717171]"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!rawJson.trim()}
              onClick={() => handleValidate()}
            >
              <Check className="mr-2 size-3.5" />
              Validate config
            </Button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#303030] px-4 py-2 text-xs font-medium transition-colors hover:bg-[#3f3f3f]">
              <FileUp className="size-3.5" />
              Upload JSON
              <input
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void file.text().then((content) => {
                      setRawJson(content);
                      handleValidate(content);
                    });
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {validationError ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-400" />
          <p className="text-sm text-red-400">{validationError}</p>
        </div>
      ) : null}

      {parsed ? (
        <div className="ui-onboarding-youtube__panel ui-overview-panel space-y-4 rounded-xl border border-[#303030] bg-[#181818] p-4">
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
            <Check className="size-3.5" />
            Valid migration config ({parsed.platform})
          </div>
          <div className="flex items-start gap-4">
            <AgentAvatar image="/ar-mark-square.png" name={parsed.name} size="lg" />
            <div className="min-w-0 space-y-1">
              <p className="font-semibold">{parsed.name}</p>
              <p className="text-sm text-muted-foreground">{parsed.summary}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {parsed.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-muted/30 px-2 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Button className="w-full" onClick={handleCreateImported}>
            <ArrowRight className="mr-2 size-4" />
            Create imported agent
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function DemoCreateAgentEntry() {
  const [mode, setMode] = useState<"choose" | "create" | "import">("choose");

  if (mode === "create") {
    return <DemoCreateAgentWizard onBackToEntry={() => setMode("choose")} />;
  }

  if (mode === "import") {
    return <DemoImportAgentConfig onBackToEntry={() => setMode("choose")} />;
  }

  return (
    <div className="ui-onboarding-youtube flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-12 text-[#f1f1f1]">
      <div className="mx-auto w-full max-w-lg space-y-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#aaa]">
            Create Agent · Step 1 of 2
          </p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#f1f1f1] sm:text-3xl">
            How would you like to add your agent?
          </h1>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-[#aaa]">
            Start fresh with the guided setup, import an existing configuration, or use the raw
            ERC-8004 contract builder.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("create")}
            className="group flex flex-col items-start gap-3 rounded-2xl border border-[#303030] bg-[#181818] p-5 text-left transition-colors hover:border-[#717171] hover:bg-[#212121]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#272727] text-[#f1f1f1] transition-colors group-hover:bg-[#3f3f3f]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-[#f1f1f1]">Create from scratch</p>
              <p className="mt-1 text-xs leading-relaxed text-[#aaa]">
                Set up name, persona, branding, and links step by step.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode("import")}
            className="group flex flex-col items-start gap-3 rounded-2xl border border-[#303030] bg-[#181818] p-5 text-left transition-colors hover:border-[#717171] hover:bg-[#212121]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#272727] text-[#f1f1f1] transition-colors group-hover:bg-[#3f3f3f]">
              <FileUp className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-[#f1f1f1]">Import existing agent</p>
              <p className="mt-1 text-xs leading-relaxed text-[#aaa]">
                Bring an agent from another platform using a JSON migration package.
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[#303030] bg-[#141414] px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[#f1f1f1]">
              Deploying directly to ERC-8004 EVM contracts?
            </p>
            <p className="mt-0.5 text-xs text-[#aaa]">
              Open the 7-step on-chain registration &amp; URI manifest builder.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/create">Open ERC-8004 Builder</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
