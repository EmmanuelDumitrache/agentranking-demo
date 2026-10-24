"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BadgeCheck,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Command,
    Flame,
    Github,
    Megaphone,
    MessageCircle,
    Plus,
    RotateCcw,
    Search,
    Send,
    ShieldCheck,
    Sparkles,
    Star,
    TrendingUp,
    Twitter,
    User,
} from "lucide-react";

import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { useFilters } from "@/contexts/filters-context";
import { useCreatedAgentsStore } from "@/stores/created-agents-store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { title: "Discovery", url: "/", icon: TrendingUp },
    { title: "Hot Agents", url: "/hot", icon: Flame },
    { title: "New Agents", url: "/new", icon: Sparkles },
    { title: "Top Rated", url: "/top", icon: Star },
    { title: "Know Your Agent", url: "/kya", icon: ShieldCheck },
    { title: "Verification", url: "/verification", icon: BadgeCheck },
    { title: "Advertise", url: "/promote", icon: Megaphone },
];

const SOCIAL_LINKS = [
    { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
    { href: "https://discord.gg", icon: MessageCircle, label: "Discord" },
    { href: "https://github.com", icon: Github, label: "GitHub" },
    { href: "https://t.me", icon: Send, label: "Telegram" },
];

const NAV_ITEM =
    "flex h-16 w-full items-center justify-start gap-3 rounded-lg px-4 text-3xl font-medium transition-colors group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!w-12 group-data-[collapsible=icon]:!min-w-12 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-center";
const NAV_ITEM_ACTIVE = "bg-accent text-accent-foreground";
const NAV_ITEM_INACTIVE = "text-muted-foreground hover:bg-accent/30 hover:text-foreground";

export function AppSidebar() {
    const pathname = usePathname();
    const { toggleSidebar, state } = useSidebar();
    const { searchQuery, setSearchQuery, clearAllFilters } = useFilters();
    const resetDemoData = useCreatedAgentsStore((s) => s.resetDemoData);
    const createdCount = useCreatedAgentsStore((s) => s.agents.length);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [accountOpen, setAccountOpen] = React.useState(true);
    const effectiveOpen = accountOpen || state === "collapsed";

    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName ?? "")) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        globalThis.addEventListener("keydown", handler);
        return () => globalThis.removeEventListener("keydown", handler);
    }, []);

    const isCollapsed = state === "collapsed";

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-border bg-sidebar">
            {/* Header: Logo + Search */}
            <div className="shrink-0 border-b border-border px-0 py-3 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:h-14 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
                <div className="group-data-[collapsible=icon]:hidden sidebar-header-content">
                    <div className="flex items-center pt-10 pb-5">
                        <Link href="/" className="flex min-w-0 items-center gap-3 shrink-0">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                                <Command className="h-6 w-6 text-primary" />
                            </div>
                            <span className="truncate text-xl font-semibold text-foreground">8004SCANNER</span>
                        </Link>
                        <div className="flex-1 min-w-0" aria-hidden="true" />
                        <button
                            type="button"
                            onClick={toggleSidebar}
                            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            className="flex shrink-0 items-center justify-center p-0 min-w-0 bg-transparent border-0 text-muted-foreground/50 hover:text-foreground transition-colors focus:outline-none"
                        >
                            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                        </button>
                    </div>
                    <div className="sidebar-search-outer">
                        <div className="sidebar-search-inner relative w-[168px] shrink-0">
                            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                ref={inputRef}
                                placeholder="Search Agents"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="sidebar-search-input !min-h-[2.5rem] w-full min-w-0 rounded-lg border-0 bg-accent/30 pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground/70 caret-foreground ring-1 ring-border/30 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    className="hidden items-center justify-center p-0 min-w-0 bg-transparent border-0 text-muted-foreground/50 hover:text-foreground transition-colors focus:outline-none group-data-[collapsible=icon]:!flex"
                    onClick={toggleSidebar}
                    aria-label="Expand sidebar"
                >
                    <ChevronRight className="h-4 w-4" strokeWidth={2} />
                </button>
            </div>

            {/* Content */}
            <div className="sidebar-content flex min-h-0 flex-1 flex-col overflow-y-auto pt-4 px-0 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:px-0">
                <Collapsible open={effectiveOpen} onOpenChange={setAccountOpen}>
                    <CollapsibleContent>
                        <nav className="sidebar-nav flex flex-col pb-2">
                            {NAV_ITEMS.map(({ title, url, icon: Icon }) => {
                                const isActive = pathname === url;
                                return (
                                    <Link
                                        key={title}
                                        href={url}
                                        className={cn(
                                            "sidebar-nav-link",
                                            NAV_ITEM,
                                            isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE
                                        )}
                                        title={title}
                                    >
                                        <Icon className="h-6 w-6 shrink-0" />
                                        <span className="truncate text-3xl group-data-[collapsible=icon]:sr-only">{title}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </CollapsibleContent>
                    <CollapsibleTrigger asChild>
                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-1 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors focus:outline-none bg-transparent border-0 rounded-none group-data-[collapsible=icon]:hidden"
                            aria-label={effectiveOpen ? "Show less" : "Show more"}
                        >
                            {effectiveOpen ? (
                                <>
                                    <span>less</span>
                                    <ChevronUp className="h-3 w-3" />
                                </>
                            ) : (
                                <>
                                    <span>more</span>
                                    <ChevronDown className="h-3 w-3" />
                                </>
                            )}
                        </button>
                    </CollapsibleTrigger>
                </Collapsible>

                {/* Create - above the divider at the bottom */}
                <div className="mt-auto flex flex-col pb-4">
                    <Link
                        href="/create"
                        className={cn(
                            "sidebar-nav-link sidebar-create-btn flex w-full items-center justify-center gap-3 rounded-lg px-4 font-medium transition-all duration-200 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!w-12 group-data-[collapsible=icon]:!min-w-12 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-center",
                            "text-white [&_svg]:text-white"
                        )}
                        title="Create Agent"
                    >
                        <Plus className="h-5 w-5 shrink-0 text-white" />
                        <span className="truncate group-data-[collapsible=icon]:sr-only">Create</span>
                    </Link>
                </div>
            </div>

            {/* Footer: Demo session + Reset Demo button + Socials */}
            <div className="sidebar-footer shrink-0 border-t border-border px-0 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-2">
                <div className="sidebar-footer-user flex items-center justify-between gap-2 group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:hidden">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                            <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex flex-col">
                            <span className="truncate text-xs font-medium text-foreground">
                                Demo Mode {createdCount > 0 ? `(${createdCount} created)` : ""}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    resetDemoData();
                                    clearAllFilters();
                                    setSearchQuery("");
                                }}
                                className="inline-flex items-center gap-1 text-left text-[11px] text-primary hover:underline cursor-pointer bg-transparent border-0 p-0"
                            >
                                <RotateCcw className="h-2.5 w-2.5" />
                                Reset Demo State
                            </button>
                        </div>
                    </div>
                </div>
                <div className="sidebar-footer-social flex w-full items-center justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:border-t-0 group-data-[collapsible=icon]:pt-0">
                    {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                        <Link
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                            aria-label={label}
                        >
                            <Icon className="h-4 w-4" />
                        </Link>
                    ))}
                </div>
            </div>
        </Sidebar>
    );
}
