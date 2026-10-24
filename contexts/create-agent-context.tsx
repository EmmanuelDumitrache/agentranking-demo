"use client";

import * as React from "react";
import {
  CreateAgentFormState,
  DEFAULT_FORM_STATE,
  StepId,
} from "@/lib/create-agent-types";
import { buildAgentMetadata } from "@/lib/build-agent-metadata";

type CreateAgentContextValue = {
  state: CreateAgentFormState;
  currentStep: StepId;
  setField: <K extends keyof CreateAgentFormState>(
    key: K,
    value: CreateAgentFormState[K]
  ) => void;
  setFieldPartial: <K extends keyof CreateAgentFormState>(
    key: K,
    updater: (prev: CreateAgentFormState[K]) => CreateAgentFormState[K]
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: StepId) => void;
  fillSampleAgent: () => void;
  reset: () => void;
  buildMetadata: (agentId?: number, agentRegistry?: string) => object;
  getAgentUri: (agentId?: number, agentRegistry?: string) => string;
};

const CreateAgentContext = React.createContext<
  CreateAgentContextValue | null
>(null);

export function CreateAgentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<CreateAgentFormState>(DEFAULT_FORM_STATE);
  const [currentStep, setCurrentStep] = React.useState<StepId>(1);

  const setField = React.useCallback(
    <K extends keyof CreateAgentFormState>(
      key: K,
      value: CreateAgentFormState[K]
    ) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const setFieldPartial = React.useCallback(
    <K extends keyof CreateAgentFormState>(
      key: K,
      updater: (prev: CreateAgentFormState[K]) => CreateAgentFormState[K]
    ) => {
      setState((prev) => ({
        ...prev,
        [key]: updater(prev[key]),
      }));
    },
    []
  );

  const nextStep = React.useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, 7) as StepId);
  }, []);

  const prevStep = React.useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1) as StepId);
  }, []);

  const goToStep = React.useCallback((step: StepId) => {
    setCurrentStep(step);
  }, []);

  const fillSampleAgent = React.useCallback(() => {
    setState({
      name: "TokyoSentinel AI",
      description:
        "Autonomous multi-chain DeFi & MEV protection agent built for high-frequency liquidity monitoring across Ethereum and Base. Exposes MCP tools and A2A endpoints with TEE execution verification.",
      imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=tokyo-sentinel",
      services: [
        {
          id: "sample-mcp",
          name: "MCP",
          endpoint: "https://sentinel.8004scanner.ai/mcp",
          version: "2025-06-18",
        },
        {
          id: "sample-web",
          name: "web",
          endpoint: "https://sentinel.8004scanner.ai",
        },
      ],
      tags: ["defi", "monitoring", "mev-protection", "mcp"],
      skills: ["Monitoring", "Analytics", "Risk"],
      domains: ["DeFi", "Risk", "Analytics"],
      supportedTrust: ["reputation", "crypto-economic", "tee-attestation"],
      active: true,
      x402Support: true,
      storageType: "auto",
      storageValue: "",
      advertiseOptions: {
        submitToDiscovery: true,
        featureOnHomepage: true,
      },
    });
  }, []);

  const reset = React.useCallback(() => {
    setState(DEFAULT_FORM_STATE);
    setCurrentStep(1);
  }, []);

  const buildMetadata = React.useCallback(
    (agentId?: number, agentRegistry?: string) => {
      return buildAgentMetadata(state, agentId, agentRegistry);
    },
    [state]
  );

  const getAgentUri = React.useCallback(
    (agentId?: number, agentRegistry?: string): string => {
      const metadata = buildAgentMetadata(state, agentId, agentRegistry);
      const json = JSON.stringify(metadata);

      if (state.storageType === "auto") {
        const base64 =
          typeof window !== "undefined"
            ? btoa(
                encodeURIComponent(json).replace(
                  /%([0-9A-F]{2})/g,
                  (_, p1) => String.fromCharCode(parseInt(p1, 16))
                )
              )
            : Buffer.from(json, "utf-8").toString("base64");
        return `data:application/json;base64,${base64}`;
      }

      if (state.storageType === "ipfs") {
        return state.storageValue.startsWith("ipfs://")
          ? state.storageValue
          : `ipfs://${state.storageValue}`;
      }

      return state.storageValue;
    },
    [state]
  );

  const value = React.useMemo(
    () => ({
      state,
      currentStep,
      setField,
      setFieldPartial,
      nextStep,
      prevStep,
      goToStep,
      fillSampleAgent,
      reset,
      buildMetadata,
      getAgentUri,
    }),
    [
      state,
      currentStep,
      setField,
      setFieldPartial,
      nextStep,
      prevStep,
      goToStep,
      fillSampleAgent,
      reset,
      buildMetadata,
      getAgentUri,
    ]
  );

  return (
    <CreateAgentContext.Provider value={value}>
      {children}
    </CreateAgentContext.Provider>
  );
}

export function useCreateAgent() {
  const ctx = React.useContext(CreateAgentContext);
  if (!ctx) throw new Error("useCreateAgent must be used within CreateAgentProvider");
  return ctx;
}
