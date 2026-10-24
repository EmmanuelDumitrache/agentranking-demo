"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateMockAgents, createdAgentToAgent } from "@/lib/mock-data";
import { useCreatedAgentsStore } from "@/stores/created-agents-store";
import { useMemo, useState } from "react";
import { formatReputation, truncateAddress, timeAgo, cn } from "@/lib/utils";
import Image from "next/image";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilters } from "@/contexts/filters-context";
import { Filter, Flame, Plus, Sparkles, Star, X } from "lucide-react";

export type SortOption = "new" | "top" | "gainers";

export function AgentsDiscovery({
    title,
    sortBy,
}: {
    title: string;
    sortBy: SortOption;
}) {
    const router = useRouter();
    const { searchQuery, setSearchQuery, filters, setFilters, clearAllFilters } = useFilters();
    const createdAgents = useCreatedAgentsStore((s) => s.agents);
    const promotions = useCreatedAgentsStore((s) => s.promotions);
    const favorites = useCreatedAgentsStore((s) => s.favorites);
    const toggleFavorite = useCreatedAgentsStore((s) => s.toggleFavorite);
    const [onlyFavorites, setOnlyFavorites] = useState(false);

    const allAgents = useMemo(() => {
        const mock = generateMockAgents(50);
        const created = createdAgents.map(createdAgentToAgent);
        const createdIds = new Set(created.map((c) => c.agentId));
        return [...created, ...mock.filter((m) => !createdIds.has(m.agentId))];
    }, [createdAgents]);

    const filteredAndSortedAgents = useMemo(() => {
        let agents = [...allAgents];

        if (onlyFavorites) {
            agents = agents.filter((a) => favorites.includes(a.agentId));
        }

        // Filter by search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            agents = agents.filter(
                (a) =>
                    a.name.toLowerCase().includes(q) ||
                    a.agentId.toString().includes(q) ||
                    a.categories.some((c) => c.toLowerCase().includes(q)) ||
                    a.protocol.toLowerCase().includes(q)
            );
        }

        // Filter by chain
        if (filters.chain) {
            agents = agents.filter((a) => a.chains.includes(filters.chain!));
        }

        // Filter by protocol
        if (filters.protocol) {
            agents = agents.filter((a) => a.protocol === filters.protocol);
        }

        // Filter by trust method
        if (filters.trustMethod) {
            agents = agents.filter((a) => a.trustMethod === filters.trustMethod);
        }

        // Filter by skill
        if (filters.skill) {
            agents = agents.filter((a) => a.skills.includes(filters.skill!));
        }

        // Filter by domain
        if (filters.domain) {
            agents = agents.filter((a) => a.domains.includes(filters.domain!));
        }

        // Filter by hasX402
        if (filters.hasX402 === true) {
            agents = agents.filter((a) => a.hasX402);
        }

        // Sort
        switch (sortBy) {
            case "new":
                return agents.sort((a, b) => {
                    if (a.isCreatedByUser && !b.isCreatedByUser) return -1;
                    if (!a.isCreatedByUser && b.isCreatedByUser) return 1;
                    return b.createdAt - a.createdAt;
                });
            case "gainers":
                return agents.sort((a, b) => {
                    const promoA = promotions[a.agentId] === "hot" ? 100 : 0;
                    const promoB = promotions[b.agentId] === "hot" ? 100 : 0;
                    return b.volumeChange24h + promoB - (a.volumeChange24h + promoA);
                });
            case "top":
            default:
                return agents.sort((a, b) => {
                    const featuredBoostA =
                        a.isCreatedByUser || promotions[a.agentId] === "featured" ? 50 : 0;
                    const featuredBoostB =
                        b.isCreatedByUser || promotions[b.agentId] === "featured" ? 50 : 0;
                    const scoreA =
                        a.reputation * 0.6 +
                        a.callVolume * 0.0003 +
                        a.successRate * 0.1 +
                        featuredBoostA;
                    const scoreB =
                        b.reputation * 0.6 +
                        b.callVolume * 0.0003 +
                        b.successRate * 0.1 +
                        featuredBoostB;
                    return scoreB - scoreA;
                });
        }
    }, [allAgents, searchQuery, sortBy, filters, onlyFavorites, favorites, promotions]);

    const activeFilterCount =
        (filters.chain ? 1 : 0) +
        (filters.protocol ? 1 : 0) +
        (filters.trustMethod ? 1 : 0) +
        (filters.skill ? 1 : 0) +
        (filters.domain ? 1 : 0) +
        (filters.hasX402 ? 1 : 0) +
        (onlyFavorites ? 1 : 0);

    return (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {/* Title + Filter Row */}
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-base font-semibold text-foreground mr-2">{title}</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5 text-sm text-foreground border-border hover:bg-accent hover:text-accent-foreground"
                            >
                                <Filter className="size-4" />
                                Filter
                                {activeFilterCount > 0 && (
                                    <span className="ml-1 rounded-full bg-primary/20 px-1.5 py-0.2 text-xs text-primary">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="min-w-[220px]">
                            <DropdownMenuLabel>Chains</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem
                                checked={filters.chain === null}
                                onCheckedChange={() =>
                                    setFilters((f) => ({ ...f, chain: null }))
                                }
                            >
                                All Chains
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={filters.chain === "Ethereum"}
                                onCheckedChange={(checked) =>
                                    setFilters((f) => ({
                                        ...f,
                                        chain: checked ? "Ethereum" : null,
                                    }))
                                }
                            >
                                Ethereum
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={filters.chain === "Sepolia"}
                                onCheckedChange={(checked) =>
                                    setFilters((f) => ({
                                        ...f,
                                        chain: checked ? "Sepolia" : null,
                                    }))
                                }
                            >
                                Sepolia
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Protocols</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem
                                checked={filters.protocol === null}
                                onCheckedChange={() =>
                                    setFilters((f) => ({ ...f, protocol: null }))
                                }
                            >
                                All Protocols
                            </DropdownMenuCheckboxItem>
                            {(["MCP", "A2A", "OASF"] as const).map((p) => (
                                <DropdownMenuCheckboxItem
                                    key={p}
                                    checked={filters.protocol === p}
                                    onCheckedChange={(checked) =>
                                        setFilters((f) => ({
                                            ...f,
                                            protocol: checked ? p : null,
                                        }))
                                    }
                                >
                                    {p}
                                </DropdownMenuCheckboxItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Trust Methods</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem
                                checked={filters.trustMethod === null}
                                onCheckedChange={() =>
                                    setFilters((f) => ({
                                        ...f,
                                        trustMethod: null,
                                    }))
                                }
                            >
                                All Trust Methods
                            </DropdownMenuCheckboxItem>
                            {["On-chain", "Off-chain", "Hybrid"].map((tm) => (
                                <DropdownMenuCheckboxItem
                                    key={tm}
                                    checked={filters.trustMethod === tm}
                                    onCheckedChange={(checked) =>
                                        setFilters((f) => ({
                                            ...f,
                                            trustMethod: checked ? tm : null,
                                        }))
                                    }
                                >
                                    {tm}
                                </DropdownMenuCheckboxItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Skills</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem
                                checked={filters.skill === null}
                                onCheckedChange={() =>
                                    setFilters((f) => ({ ...f, skill: null }))
                                }
                            >
                                All Skills
                            </DropdownMenuCheckboxItem>
                            {["Trading", "Analytics", "Execution", "Monitoring", "Risk"].map(
                                (s) => (
                                    <DropdownMenuCheckboxItem
                                        key={s}
                                        checked={filters.skill === s}
                                        onCheckedChange={(checked) =>
                                            setFilters((f) => ({
                                                ...f,
                                                skill: checked ? s : null,
                                            }))
                                        }
                                    >
                                        {s}
                                    </DropdownMenuCheckboxItem>
                                )
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Domains</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem
                                checked={filters.domain === null}
                                onCheckedChange={() =>
                                    setFilters((f) => ({ ...f, domain: null }))
                                }
                            >
                                All Domains
                            </DropdownMenuCheckboxItem>
                            {["DeFi", "Risk", "Infra", "Trading", "Analytics"].map(
                                (d) => (
                                    <DropdownMenuCheckboxItem
                                        key={d}
                                        checked={filters.domain === d}
                                        onCheckedChange={(checked) =>
                                            setFilters((f) => ({
                                                ...f,
                                                domain: checked ? d : null,
                                            }))
                                        }
                                    >
                                        {d}
                                    </DropdownMenuCheckboxItem>
                                )
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={filters.hasX402 === true}
                                onCheckedChange={(checked) =>
                                    setFilters((f) => ({
                                        ...f,
                                        hasX402: checked ? true : null,
                                    }))
                                }
                            >
                                Has Agent Wallet (X402)
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-muted-foreground"
                                onSelect={() => {
                                    clearAllFilters();
                                    setOnlyFavorites(false);
                                }}
                            >
                                Clear All Filters
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant={onlyFavorites ? "default" : "outline"}
                        size="sm"
                        className="h-8 gap-1.5 text-xs"
                        onClick={() => setOnlyFavorites((v) => !v)}
                    >
                        <Star
                            className={cn(
                                "size-3.5",
                                onlyFavorites && "fill-current"
                            )}
                        />
                        Watchlist ({favorites.length})
                    </Button>

                    {(activeFilterCount > 0 || searchQuery.trim()) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => {
                                clearAllFilters();
                                setOnlyFavorites(false);
                                setSearchQuery("");
                            }}
                        >
                            <X className="size-3.5" />
                            Reset
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                        Showing {filteredAndSortedAgents.length} agents
                    </span>
                    <Link href="/create">
                        <Button size="sm" className="h-8 gap-1.5 text-xs">
                            <Plus className="size-3.5" />
                            Create Agent
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Table - scrollable, scrollbar confined to table area */}
            <div className="min-h-0 min-w-0 w-full max-w-full flex-1 overflow-x-auto overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-border hover:bg-transparent">
                            <TableHead className="w-[40px] min-w-[40px] text-[10px] font-medium text-muted-foreground uppercase tracking-wide">#</TableHead>
                            <TableHead className="w-[240px] min-w-[240px] text-[10px] font-medium text-muted-foreground uppercase tracking-wide">AGENT</TableHead>
                            <TableHead className="w-[90px] min-w-[90px] text-[10px] font-medium text-muted-foreground uppercase tracking-wide">CHAIN</TableHead>
                            <TableHead className="w-[90px] min-w-[90px] text-[10px] font-medium text-muted-foreground uppercase tracking-wide">TYPE</TableHead>
                            <TableHead className="w-[80px] min-w-[80px] text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wide">SCORE</TableHead>
                            <TableHead className="w-[70px] min-w-[70px] text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wide">24H</TableHead>
                            <TableHead className="w-[90px] min-w-[90px] text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wide">FEEDBACK</TableHead>
                            <TableHead className="w-[80px] min-w-[80px] text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wide">STARS</TableHead>
                            <TableHead className="w-[120px] min-w-[120px] text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wide">OWNER</TableHead>
                            <TableHead className="w-[120px] min-w-[120px] text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wide">X402</TableHead>
                            <TableHead className="w-[90px] min-w-[90px] text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wide pr-4">CREATED</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedAgents.map((agent, index) => {
                            const volChange = agent.volumeChange24h;
                            const isPositive = volChange >= 0;
                            const promoTier = promotions[agent.agentId];
                            const isFav = favorites.includes(agent.agentId);

                            return (
                                <TableRow
                                    key={agent.id}
                                    className={cn(
                                        "cursor-pointer border-b border-border/50 transition-colors",
                                        index % 2 === 0 ? "bg-transparent" : "bg-muted/30",
                                        "hover:bg-muted/50"
                                    )}
                                    onClick={() => router.push(`/agent/${agent.agentId}`)}
                                >
                                    <TableCell className="text-xs text-muted-foreground font-mono py-2">
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(agent.agentId);
                                                }}
                                                className="text-muted-foreground hover:text-accent-green focus:outline-none"
                                                aria-label="Toggle favorite"
                                            >
                                                <Star
                                                    className={cn(
                                                        "h-3.5 w-3.5",
                                                        isFav && "fill-accent-green text-accent-green"
                                                    )}
                                                />
                                            </button>
                                            <span>#{index + 1}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={agent.image}
                                                alt={agent.name}
                                                width={28}
                                                height={28}
                                                className="w-7 h-7 rounded-full shrink-0"
                                                unoptimized
                                            />
                                            <div className="min-w-0 flex items-center gap-1.5">
                                                <span className="text-xs font-medium text-foreground truncate">
                                                    {agent.name}
                                                </span>
                                                {agent.isCreatedByUser && (
                                                    <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-primary/50 text-primary bg-primary/10">
                                                        <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                                                        Yours
                                                    </Badge>
                                                )}
                                                {promoTier === "featured" && (
                                                    <span
                                                        title="Featured Listing"
                                                        className="inline-flex items-center gap-0.5 rounded bg-yellow-500/15 px-1.5 py-0.5 text-[10px] font-medium text-yellow-400"
                                                    >
                                                        <Star className="h-2.5 w-2.5 fill-current" />
                                                        Featured
                                                    </span>
                                                )}
                                                {promoTier === "hot" && (
                                                    <span
                                                        title="Hot Promoted Listing"
                                                        className="inline-flex items-center gap-0.5 rounded bg-orange-500/15 px-1.5 py-0.5 text-[10px] font-medium text-orange-400"
                                                    >
                                                        <Flame className="h-2.5 w-2.5 fill-current" />
                                                        Hot
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {agent.chains[0] === "Ethereum" ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#342A5C] px-2 py-0.5 text-xs font-medium text-[#C5C2E6]">
                                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#6C63FF] p-0.5">
                                                    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 text-white" fill="currentColor">
                                                        <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                                                    </svg>
                                                </span>
                                                Ethereum
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#342A5C] px-2 py-0.5 text-xs font-medium text-[#C5C2E6]">
                                                {agent.chains[0]}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <span className="text-xs text-muted-foreground">
                                            {agent.categories[0] || "DeFi"} · {agent.protocol}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right py-2">
                                        <span className="text-sm font-semibold text-accent-green">
                                            {formatReputation(agent.reputation)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right py-2">
                                        <span
                                            className={cn(
                                                "text-xs font-medium",
                                                isPositive ? "text-accent-green" : "text-accent-red"
                                            )}
                                        >
                                            {isPositive ? "+" : ""}
                                            {volChange.toFixed(1)}%
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right py-2">
                                        <span className="text-sm text-foreground">{agent.feedbackCount}</span>
                                    </TableCell>
                                    <TableCell className="text-right py-2">
                                        <div className="flex justify-end items-center gap-1">
                                            <span className="text-sm font-medium text-foreground">{agent.stars}</span>
                                            <span className="text-xs text-accent-green">★</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <code className="text-xs text-muted-foreground font-mono hover:text-accent-green transition-colors">
                                            {truncateAddress(agent.owner)}
                                        </code>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <code className="text-xs text-muted-foreground font-mono hover:text-accent-green transition-colors">
                                            {agent.paymentAddress
                                                ? truncateAddress(agent.paymentAddress)
                                                : "—"}
                                        </code>
                                    </TableCell>
                                    <TableCell className="text-right py-2 pr-4">
                                        <span className="text-xs text-muted-foreground">{timeAgo(agent.createdAt)}</span>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {filteredAndSortedAgents.length === 0 && (
                <div className="py-16 text-center text-muted-foreground text-sm space-y-3">
                    <p>No agents match your current filters.</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            clearAllFilters();
                            setOnlyFavorites(false);
                            setSearchQuery("");
                        }}
                    >
                        Reset Filters
                    </Button>
                </div>
            )}
        </div>
    );
}
