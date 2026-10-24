import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTokenExplorerUrl } from "@/lib/chains";
import type { AgentData } from "@/lib/agent-data";

function AgentAvatar({
  image,
  name,
}: {
  image?: string;
  name: string;
}) {
  let imgSrc = image || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(name)}`;
  const isDataUri = imgSrc.startsWith("data:");
  const isIpfs = imgSrc.startsWith("ipfs://");

  if (isIpfs) {
    const cid = imgSrc.replace(/^ipfs:\/\//, "");
    imgSrc = `https://ipfs.io/ipfs/${cid}`;
  }

  if (isDataUri) {
    return (
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-muted">
      <Image
        src={imgSrc}
        alt={name}
        width={80}
        height={80}
        className="h-full w-full object-cover"
        unoptimized={imgSrc.includes("ipfs") || imgSrc.includes("arweave")}
      />
    </div>
  );
}

export function AgentHeader({ agent }: { agent: AgentData }) {
  const {
    agentId,
    chainId,
    chainName,
    registry,
    owner,
    metadata,
  } = agent;
  const name = metadata.name ?? `Agent #${agentId}`;
  const description = metadata.description ?? "";
  const image = metadata.image;
  const tags = metadata.tags ?? [];
  const supportedTrust = metadata.supportedTrust ?? [];
  const active = metadata.active ?? true;
  const x402Support = metadata.x402Support ?? false;

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Agents
        </Link>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-3">
              <AgentAvatar image={image} name={name} />
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-normal">
                  {chainName}
                </Badge>
                <h1 className="text-xl font-bold text-foreground md:text-2xl">
                  {name}
                </h1>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-current text-accent-green" />
                0
              </span>
              <a
                href={getTokenExplorerUrl(agent.chainId, agent.registry, agent.agentId)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  View on Explorer
                </Button>
              </a>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Star className="h-4 w-4" />
                <span className="sr-only">Favorite</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
          {description && (
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
              {description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Rank —</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">0 feedback</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">Last active —</span>
            <span className="mx-2 text-muted-foreground">|</span>
            <Badge variant="outline">Unverified</Badge>
            {active && <Badge variant="secondary">+ Active</Badge>}
            {x402Support && <Badge variant="secondary">Staked</Badge>}
            {supportedTrust.includes("tee-attestation") && (
              <Badge variant="secondary">TEE Verified</Badge>
            )}
            {supportedTrust.includes("reputation") && (
              <Badge variant="secondary">• Reputation</Badge>
            )}
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="mb-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="feedback">Feedback (0)</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
}
