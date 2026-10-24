"use client";

import { useCreateAgent } from "@/contexts/create-agent-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { StorageType } from "@/lib/create-agent-types";

const STORAGE_OPTIONS: {
  value: StorageType;
  label: string;
  desc: string;
  recommended?: boolean;
}[] = [
  {
    value: "auto",
    label: "Auto (Data URI)",
    desc: "We'll automatically convert your metadata to a base64-encoded data URI and store it directly on-chain. This is the simplest option and requires no external hosting.",
    recommended: true,
  },
  {
    value: "ipfs",
    label: "IPFS URL",
    desc: "Use an existing IPFS URL where you've already uploaded your metadata JSON file.",
  },
  {
    value: "https",
    label: "HTTPS URL",
    desc: "Use a standard HTTPS URL pointing to your metadata JSON file.",
  },
];

export function StepStorage() {
  const { state, setField } = useCreateAgent();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata Storage</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose how to store your agent&apos;s metadata
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={state.storageType}
          onValueChange={(v) => setField("storageType", v as StorageType)}
          className="space-y-3"
        >
          {STORAGE_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                state.storageType === opt.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              )}
              onClick={() => setField("storageType", opt.value)}
            >
              <RadioGroupItem value={opt.value} id={opt.value} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor={opt.value} className="font-medium cursor-pointer">
                    {opt.label}
                  </Label>
                  {opt.recommended && (
                    <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-0.5 rounded">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{opt.desc}</p>
              </div>
            </div>
          ))}
        </RadioGroup>

        {state.storageType === "ipfs" && (
          <div className="space-y-2">
            <Label htmlFor="ipfs-url">IPFS CID or URL</Label>
            <Input
              id="ipfs-url"
              placeholder="Qm... or ipfs://Qm..."
              value={state.storageValue}
              onChange={(e) => setField("storageValue", e.target.value)}
            />
          </div>
        )}

        {state.storageType === "https" && (
          <div className="space-y-2">
            <Label htmlFor="https-url">HTTPS URL</Label>
            <Input
              id="https-url"
              placeholder="https://example.com/agent-metadata.json"
              value={state.storageValue}
              onChange={(e) => setField("storageValue", e.target.value)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
