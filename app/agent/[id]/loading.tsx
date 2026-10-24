import { Skeleton } from "@/components/ui/skeleton";

export default function AgentLoading() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 md:p-6">
        <div className="container mx-auto space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-40 w-full" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-6 lg:col-span-1">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
