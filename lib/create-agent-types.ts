// Types for ERC 8004 agent creation flow

export type StorageType = "auto" | "ipfs" | "https";

export type TrustMechanism = "reputation" | "crypto-economic" | "tee-attestation";

export interface ServiceEndpoint {
  id: string;
  name: string;
  endpoint: string;
  version?: string;
  skills?: string[];
  domains?: string[];
}

export interface AdvertiseOptions {
  submitToDiscovery: boolean;
  featureOnHomepage: boolean;
  promotionTier?: "hot" | "featured";
  paymentToken?: "ETH" | "USDC" | "SOL";
}

export interface CreateAgentFormState {
  // Step 1: Agent Info
  name: string;
  description: string;
  imageUrl: string;

  // Step 2: Endpoints
  services: ServiceEndpoint[];

  // Step 3: Capabilities
  tags: string[];
  skills: string[];
  domains: string[];

  // Step 4: Advanced
  supportedTrust: TrustMechanism[];
  active: boolean;
  x402Support: boolean;

  // Step 5: Storage
  storageType: StorageType;
  storageValue: string; // IPFS CID or HTTPS URL when storageType is ipfs/https

  // Step 6: Advertise
  advertiseOptions: AdvertiseOptions;
}

export const DEFAULT_FORM_STATE: CreateAgentFormState = {
  name: "",
  description: "",
  imageUrl: "",
  services: [],
  tags: [],
  skills: [],
  domains: [],
  supportedTrust: [],
  active: true,
  x402Support: false,
  storageType: "auto",
  storageValue: "",
  advertiseOptions: {
    submitToDiscovery: true,
    featureOnHomepage: false,
  },
};

export const STEPS = [
  { id: 1, key: "agentInfo", label: "Basic Info" },
  { id: 2, key: "endpoints", label: "Endpoints" },
  { id: 3, key: "capabilities", label: "Capabilities" },
  { id: 4, key: "advanced", label: "Advanced" },
  { id: 5, key: "storage", label: "Storage" },
  { id: 6, key: "advertise", label: "Advertise" },
  { id: 7, key: "launch", label: "Launch" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];
