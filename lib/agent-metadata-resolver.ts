/**
 * Resolves agentURI to parsed JSON metadata.
 * Supports: data:application/json;base64, ipfs://, https://
 */

const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
];

async function fetchWithRetry(url: string, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      });
      if (res.ok) return res;
      if (i < retries) await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    } catch {
      if (i < retries) await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw new Error(`Failed to fetch: ${url}`);
}

function parseDataUri(uri: string): Record<string, unknown> {
  const base64Regex = /^data:application\/json(?:;charset=utf-8)?;base64,(.+)$/i;
  const dataMatch = base64Regex.exec(uri);
  if (dataMatch) {
    const base64 = dataMatch[1];
    const json = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json) as Record<string, unknown>;
  }

  const plainRegex = /^data:application\/json,(.+)$/i;
  const plainMatch = plainRegex.exec(uri);
  if (plainMatch) {
    try {
      return JSON.parse(decodeURIComponent(plainMatch[1])) as Record<string, unknown>;
    } catch {
      return JSON.parse(plainMatch[1]) as Record<string, unknown>;
    }
  }

  throw new Error("Unsupported data URI format");
}

async function fetchIpfs(cid: string): Promise<Record<string, unknown>> {
  const path = cid.replace(/^ipfs:\/\//, "");
  let lastError: Error | null = null;

  for (const gateway of IPFS_GATEWAYS) {
    try {
      const url = gateway + path;
      const res = await fetchWithRetry(url);
      return (await res.json()) as Record<string, unknown>;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }

  throw lastError ?? new Error("IPFS fetch failed");
}

async function fetchHttps(url: string): Promise<Record<string, unknown>> {
  const res = await fetchWithRetry(url);
  return (await res.json()) as Record<string, unknown>;
}

export interface AgentMetadata {
  name?: string;
  description?: string;
  image?: string;
  services?: Array<{ name?: string; endpoint?: string; version?: string }>;
  endpoints?: Array<{ name?: string; endpoint?: string; version?: string }>;
  tags?: string[];
  supportedTrust?: string[];
  active?: boolean;
  x402Support?: boolean;
  updatedAt?: number;
  registrations?: Array<{ agentId?: number; agentRegistry?: string }>;
}

export async function resolveAgentUri(agentUri: string): Promise<AgentMetadata> {
  const trimmed = agentUri?.trim();
  if (!trimmed) {
    throw new Error("Empty agent URI");
  }

  let raw: Record<string, unknown>;

  try {
  if (trimmed.startsWith("data:")) {
    raw = parseDataUri(trimmed);
  } else if (trimmed.startsWith("ipfs://")) {
    raw = await fetchIpfs(trimmed);
  } else if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    raw = await fetchHttps(trimmed);
  } else if (trimmed.startsWith("ar://")) {
    const txId = trimmed.replace(/^ar:\/\//, "").split("/")[0];
    const url = `https://arweave.net/${txId}`;
    raw = await fetchHttps(url);
  } else {
    raw = JSON.parse(trimmed) as Record<string, unknown>;
  }
  } catch (err) {
    throw new Error(
      `Failed to resolve agent URI: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  const services = (raw.services ?? raw.endpoints) as AgentMetadata["services"];
  return {
    name: raw.name as string | undefined,
    description: raw.description as string | undefined,
    image: raw.image as string | undefined,
    services: Array.isArray(services) ? services : undefined,
    endpoints: Array.isArray(raw.endpoints) ? raw.endpoints : undefined,
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : undefined,
    supportedTrust: Array.isArray(raw.supportedTrust)
      ? (raw.supportedTrust as string[])
      : undefined,
    active: raw.active as boolean | undefined,
    x402Support: raw.x402Support as boolean | undefined,
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : undefined,
    registrations: Array.isArray(raw.registrations) ? raw.registrations : undefined,
  };
}
