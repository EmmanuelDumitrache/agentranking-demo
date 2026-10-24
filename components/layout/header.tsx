"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const SectionDivider = () => (
  <span className="h-5 w-px shrink-0 bg-muted-foreground/40" aria-hidden />
);

const NavDivider = () => (
  <span
    className="shrink-0 bg-muted-foreground/60"
    style={{ width: 1, height: 14, marginLeft: 8, marginRight: 8 }}
    aria-hidden
  />
);

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background px-6">
      <div className="flex flex-1 items-center">
        {/* Stats section */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex min-w-[4.5rem] flex-col gap-0.5 py-2 pr-8">
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Agents</span>
                <span className="font-semibold text-foreground">20K</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="flex flex-col gap-0.5 py-2">
              <span>Ethereum 20,000</span>
              <span className="text-muted-foreground">Sepolia 726</span>
            </TooltipContent>
          </Tooltip>
          <SectionDivider />
          <div className="flex min-w-[4.5rem] flex-col gap-0.5 py-2 px-8">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Feedback</span>
            <span className="font-semibold text-foreground">1.2M</span>
          </div>
          <SectionDivider />
          <div className="flex min-w-[4.5rem] flex-col gap-0.5 py-2 pl-8">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Users</span>
            <span className="font-semibold text-foreground">10K</span>
          </div>
        </div>

        {/* Nav section */}
        <div className="ml-10 flex items-center">
          <SectionDivider />
          <nav className="flex items-center pl-8" style={{ gap: 12 }}>
            <Link
              href="/"
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors hover:text-foreground rounded-md hover:bg-muted/50",
                pathname === "/" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Home
            </Link>
            <NavDivider />
            <Link
              href="/news"
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors hover:text-foreground rounded-md hover:bg-muted/50",
                pathname === "/news" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              News
            </Link>
            <NavDivider />
            <Link
              href="/contact"
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors hover:text-foreground rounded-md hover:bg-muted/50",
                pathname === "/contact" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Contact
            </Link>
          </nav>
        </div>

      </div>
    </header>
  );
}
