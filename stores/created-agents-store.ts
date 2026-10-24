import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ServiceEndpoint, TrustMechanism } from "@/lib/create-agent-types";

export interface CreatedAgent {
  agentId: number;
  chainId: number;
  chainName?: string;
  registry: string;
  name: string;
  description?: string;
  image: string;
  endpoint: string;
  services?: ServiceEndpoint[];
  tags?: string[];
  skills?: string[];
  domains?: string[];
  supportedTrust?: TrustMechanism[];
  active?: boolean;
  x402Support?: boolean;
  featured?: boolean;
  agentURI?: string;
  createdAt: number;
}

export interface UserFeedbackItem {
  id: string;
  address: string;
  comment: string;
  tags: string[];
  timestamp: number;
  score: number;
}

interface CreatedAgentsState {
  agents: CreatedAgent[];
  favorites: number[];
  promotions: Record<number, "hot" | "featured">;
  feedbackByAgent: Record<number, UserFeedbackItem[]>;
  addAgent: (agent: CreatedAgent) => void;
  getAgent: (agentId: number, chainId?: number) => CreatedAgent | undefined;
  toggleFavorite: (agentId: number) => void;
  promoteAgent: (agentId: number, tier: "hot" | "featured") => void;
  addFeedback: (agentId: number, item: UserFeedbackItem) => void;
  resetDemoData: () => void;
}

export const useCreatedAgentsStore = create<CreatedAgentsState>()(
  persist(
    (set, get) => ({
      agents: [],
      favorites: [],
      promotions: {
        1: "featured",
        2: "hot",
        3: "featured",
      },
      feedbackByAgent: {},
      addAgent: (agent) =>
        set((state) => {
          const filtered = state.agents.filter(
            (a) => !(a.agentId === agent.agentId && a.chainId === agent.chainId)
          );
          const nextPromotions = { ...state.promotions };
          if (agent.featured) {
            nextPromotions[agent.agentId] = "featured";
          }
          return {
            agents: [agent, ...filtered],
            promotions: nextPromotions,
          };
        }),
      getAgent: (agentId, chainId) =>
        get().agents.find(
          (a) =>
            Number(a.agentId) === Number(agentId) &&
            (chainId == null || a.chainId === chainId)
        ),
      toggleFavorite: (agentId) =>
        set((state) => ({
          favorites: state.favorites.includes(agentId)
            ? state.favorites.filter((id) => id !== agentId)
            : [...state.favorites, agentId],
        })),
      promoteAgent: (agentId, tier) =>
        set((state) => ({
          promotions: {
            ...state.promotions,
            [agentId]: tier,
          },
        })),
      addFeedback: (agentId, item) =>
        set((state) => ({
          feedbackByAgent: {
            ...state.feedbackByAgent,
            [agentId]: [item, ...(state.feedbackByAgent[agentId] ?? [])],
          },
        })),
      resetDemoData: () =>
        set({
          agents: [],
          favorites: [],
          promotions: { 1: "featured", 2: "hot", 3: "featured" },
          feedbackByAgent: {},
        }),
    }),
    { name: "agentranking-demo-store-v1" }
  )
);
