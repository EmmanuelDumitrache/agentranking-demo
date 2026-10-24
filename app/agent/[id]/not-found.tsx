import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AgentNotFound() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-xl font-semibold text-foreground">Agent not found</h1>
      <p className="text-muted-foreground">
        This agent may not exist or may not be registered on the selected chain.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-primary transition-colors hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Agents
      </Link>
    </div>
  );
}
