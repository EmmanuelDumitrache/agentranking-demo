"use client";

import { FileText, Globe, Tag, Settings, Database, Megaphone, Eye, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEPS, type StepId } from "@/lib/create-agent-types";

const STEP_ICONS: Record<StepId, React.ComponentType<{ className?: string }>> = {
  1: FileText,
  2: Globe,
  3: Tag,
  4: Settings,
  5: Database,
  6: Megaphone,
  7: Eye,
};

interface CreateAgentStepperProps {
  currentStep: StepId;
  onStepClick?: (step: StepId) => void;
  className?: string;
}

export function CreateAgentStepper({
  currentStep,
  onStepClick,
  className,
}: CreateAgentStepperProps) {
  return (
    <nav
      className={cn("flex flex-wrap items-center gap-1 sm:gap-2", className)}
      aria-label="Create agent steps"
    >
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const Icon = STEP_ICONS[step.id];

        return (
          <div key={step.id} className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => onStepClick?.(step.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-sm font-medium transition-colors cursor-pointer hover:bg-accent/50",
                isCurrent && "bg-primary/20 text-primary",
                isCompleted && "text-primary",
                !isCurrent && !isCompleted && "text-muted-foreground"
              )}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full",
                  isCurrent && "bg-primary text-primary-foreground",
                  isCompleted && "bg-primary/20 text-primary",
                  !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {index < STEPS.length - 1 && (
              <span
                className="text-muted-foreground/50 text-xs sm:text-sm"
                aria-hidden
              >
                &gt;
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
