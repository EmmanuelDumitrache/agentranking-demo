"use client";

import { AgentsDiscovery } from "@/components/agents-discovery";

export default function NewAgentsPage() {
    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col p-4 md:p-6">
            <AgentsDiscovery title="New Agents" sortBy="new" />
        </main>
    );
}
