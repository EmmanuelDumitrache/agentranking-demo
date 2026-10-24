"use client";

import { useCreateAgent } from "@/contexts/create-agent-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function StepAgentInfo() {
  const { state, setField } = useCreateAgent();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <p className="text-sm text-muted-foreground">
          The name, image, and description will be displayed across all ERC-721
          compatible apps, explorers, and marketplaces.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="agent-name">
            Agent Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="agent-name"
            placeholder="My Awesome Agent"
            value={state.name}
            onChange={(e) => setField("name", e.target.value)}
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground">
            Make it descriptive, concise, and memorable ({state.name.length}/100
            characters)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Explain what your agent does, how it works, what problems it solves, pricing if applicable, and how users can interact with it..."
            value={state.description}
            onChange={(e) => setField("description", e.target.value)}
            maxLength={2000}
            rows={5}
          />
          <p className="text-xs text-muted-foreground">
            {state.description.length}/2000 - Minimum 50 characters recommended
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image-url">Image URL (optional)</Label>
          <Input
            id="image-url"
            placeholder="https://example.com/agent-image.png or ipfs://..."
            value={state.imageUrl}
            onChange={(e) => setField("imageUrl", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            High-quality image (PNG, SVG, or WebP recommended). Supports HTTP,
            HTTPS, or IPFS URLs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
