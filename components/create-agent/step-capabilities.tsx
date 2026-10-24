"use client";

import { useState } from "react";
import { useCreateAgent } from "@/contexts/create-agent-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const COMMON_SKILLS = [
  "natural_language_processing/summarization",
  "natural_language_processing/translation",
  "natural_language_processing/sentiment_analysis",
  "code_generation/python",
  "code_generation/javascript",
  "data_analysis/visualization",
];

const COMMON_DOMAINS = [
  "finance_and_business/investment_services",
  "finance_and_business/accounting",
  "healthcare/diagnosis_support",
  "education/tutoring",
  "technology/software_development",
  "creative/content_creation",
];

export function StepCapabilities() {
  const { state, setFieldPartial } = useCreateAgent();
  const [tagInput, setTagInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [domainInput, setDomainInput] = useState("");

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !state.tags.includes(t)) {
      setFieldPartial("tags", (prev) => [...prev, t]);
      setTagInput("");
    }
  };

  const addSkill = (skill?: string) => {
    const s = (skill ?? skillInput).trim();
    if (s && !state.skills.includes(s)) {
      setFieldPartial("skills", (prev) => [...prev, s]);
      if (!skill) setSkillInput("");
    }
  };

  const addDomain = (domain?: string) => {
    const d = (domain ?? domainInput).trim();
    if (d && !state.domains.includes(d)) {
      setFieldPartial("domains", (prev) => [...prev, d]);
      if (!domain) setDomainInput("");
    }
  };

  const removeTag = (t: string) => {
    setFieldPartial("tags", (prev) => prev.filter((x) => x !== t));
  };

  const removeSkill = (s: string) => {
    setFieldPartial("skills", (prev) => prev.filter((x) => x !== s));
  };

  const removeDomain = (d: string) => {
    setFieldPartial("domains", (prev) => prev.filter((x) => x !== d));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Capabilities (Optional)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Add OASF (Open Agentic Schema Framework) skills and domains to help
          users discover your agent.{" "}
          <a
            href="https://schema.oasf.outshift.com/0.8.0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View the complete list
          </a>
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Tags</Label>
          <p className="text-xs text-muted-foreground">
            Free-form discovery keywords stored in your agent&apos;s metadata
            (e.g., &quot;defi&quot;, &quot;chatbot&quot;).
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <Button size="icon" onClick={addTag} disabled={!tagInput.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {state.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {state.tags.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeTag(t)}
                >
                  {t} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>OASF Skills (optional)</Label>
          <p className="text-xs text-muted-foreground">
            Use slash-separated paths (e.g.,
            &quot;natural_language_processing/summarization&quot;)
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSkill())
              }
            />
            <Button size="icon" onClick={() => addSkill()} disabled={!skillInput.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Common skills (click to add):
          </p>
          <div className="flex flex-wrap gap-2">
            {COMMON_SKILLS.map((s) => (
              <Badge
                key={s}
                variant="outline"
                className={cn(
                  "cursor-pointer",
                  state.skills.includes(s) && "bg-primary/20 border-primary"
                )}
                onClick={() =>
                  state.skills.includes(s) ? removeSkill(s) : addSkill(s)
                }
              >
                + {s}
              </Badge>
            ))}
          </div>
          {state.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {state.skills.map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeSkill(s)}
                >
                  {s} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>OASF Domains (optional)</Label>
          <p className="text-xs text-muted-foreground">
            Use slash-separated paths (e.g.,
            &quot;finance_and_business/investment_services&quot;)
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Add a domain..."
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addDomain())
              }
            />
            <Button size="icon" onClick={() => addDomain()} disabled={!domainInput.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Common domains (click to add):
          </p>
          <div className="flex flex-wrap gap-2">
            {COMMON_DOMAINS.map((d) => (
              <Badge
                key={d}
                variant="outline"
                className={cn(
                  "cursor-pointer",
                  state.domains.includes(d) && "bg-primary/20 border-primary"
                )}
                onClick={() =>
                  state.domains.includes(d) ? removeDomain(d) : addDomain(d)
                }
              >
                + {d}
              </Badge>
            ))}
          </div>
          {state.domains.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {state.domains.map((d) => (
                <Badge
                  key={d}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeDomain(d)}
                >
                  {d} ×
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
