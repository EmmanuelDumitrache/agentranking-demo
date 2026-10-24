"use client";

import Link from "next/link";
import { CreateAgentProvider, useCreateAgent } from "@/contexts/create-agent-context";
import { CreateAgentStepper } from "@/components/create-agent-stepper";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, RotateCcw } from "lucide-react";
import { StepAgentInfo } from "@/components/create-agent/step-agent-info";
import { StepEndpoints } from "@/components/create-agent/step-endpoints";
import { StepCapabilities } from "@/components/create-agent/step-capabilities";
import { StepAdvanced } from "@/components/create-agent/step-advanced";
import { StepStorage } from "@/components/create-agent/step-storage";
import { StepAdvertise } from "@/components/create-agent/step-advertise";
import { StepLaunch } from "@/components/create-agent/step-launch";

function CreateAgentWizard() {
  const { currentStep, nextStep, prevStep, goToStep, fillSampleAgent, reset } =
    useCreateAgent();

  const steps = [
    { id: 1, component: StepAgentInfo },
    { id: 2, component: StepEndpoints },
    { id: 3, component: StepCapabilities },
    { id: 4, component: StepAdvanced },
    { id: 5, component: StepStorage },
    { id: 6, component: StepAdvertise },
    { id: 7, component: StepLaunch },
  ];

  const current = steps.find((s) => s.id === currentStep);
  const StepComponent = current?.component;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Discovery
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">
            Create ERC-8004 Agent
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Register your AI agent metadata and make it discoverable across the rankings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              fillSampleAgent();
            }}
            className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Prefill Demo Agent
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={reset}
            className="gap-1.5 text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </div>

      <CreateAgentStepper currentStep={currentStep} onStepClick={goToStep} />

      <div className="flex-1 min-h-0">
        {StepComponent && <StepComponent />}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of 7
        </span>
        {currentStep < 7 ? (
          <Button onClick={nextStep} className="gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export default function CreateAgentPage() {
  return (
    <CreateAgentProvider>
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <CreateAgentWizard />
      </main>
    </CreateAgentProvider>
  );
}
