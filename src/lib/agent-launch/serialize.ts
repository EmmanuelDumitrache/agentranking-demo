import type { SerializedAgentLaunch, SerializedAgentLaunchDistribution } from "@/components/agent-launch/types";

export function serializeAgentLaunch(launch: unknown): SerializedAgentLaunch {
  return launch as SerializedAgentLaunch;
}

export function serializeAgentLaunchDistribution(dist: unknown): SerializedAgentLaunchDistribution {
  return dist as SerializedAgentLaunchDistribution;
}
