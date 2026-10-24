"use client";

import { useCreateAgent } from "@/contexts/create-agent-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Checkbox as TrustCheckbox } from "@/components/ui/checkbox";
import type { TrustMechanism } from "@/lib/create-agent-types";

const TRUST_OPTIONS: { value: TrustMechanism; label: string; desc: string }[] = [
  {
    value: "reputation",
    label: "Reputation-based Trust",
    desc: "Validators provide subjective feedback on agent performance and behavior (thumbs up/down, star ratings, text reviews)",
  },
  {
    value: "crypto-economic",
    label: "Crypto-economic Trust",
    desc: "Validators stake tokens to vouch for agent behavior; slashed if found malicious",
  },
  {
    value: "tee-attestation",
    label: "TEE Attestation Trust",
    desc: "Trusted Execution Environment provides cryptographic proof of agent code and execution integrity",
  },
];

export function StepAdvanced() {
  const { state, setField, setFieldPartial } = useCreateAgent();

  const toggleTrust = (t: TrustMechanism) => {
    setFieldPartial("supportedTrust", (prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Options (Optional)</CardTitle>
        <p className="text-sm text-muted-foreground">
          All fields are optional and can be updated later.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Supported Trust Mechanisms (optional)</Label>
          <div className="space-y-3">
            {TRUST_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                className="flex items-start gap-3 rounded-lg border border-border p-4"
              >
                <TrustCheckbox
                  id={opt.value}
                  checked={state.supportedTrust.includes(opt.value)}
                  onCheckedChange={() => toggleTrust(opt.value)}
                />
                <div className="flex-1">
                  <Label
                    htmlFor={opt.value}
                    className="font-medium cursor-pointer"
                  >
                    {opt.label}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {opt.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Checkbox
              id="active"
              checked={state.active}
              onCheckedChange={(v) => setField("active", !!v)}
            />
            <div>
              <Label htmlFor="active" className="font-medium cursor-pointer">
                Agent is Active
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Check this if your agent is operational and ready to receive
                requests. Uncheck for maintenance or testing periods.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Checkbox
              id="x402"
              checked={state.x402Support}
              onCheckedChange={(v) => setField("x402Support", !!v)}
            />
            <div>
              <Label htmlFor="x402" className="font-medium cursor-pointer">
                HTTP 402 Payment Support
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Check this if your agent implements the HTTP 402 standard for
                paid services (microtransactions, per-request billing).
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
