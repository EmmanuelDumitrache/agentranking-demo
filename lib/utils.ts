import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format numbers with K, M, B suffixes (DexScreener style)
export function formatNumber(num: number): string {
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(2) + "B";
    }
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(2) + "M";
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(2) + "K";
    }
    return num.toFixed(0);
}

// Format percentage with sign
export function formatPercentage(num: number, decimals: number = 1): string {
    const sign = num >= 0 ? "+" : "";
    return sign + num.toFixed(decimals) + "%";
}

// Format latency (ms)
export function formatLatency(ms: number): string {
    return ms.toFixed(0) + "ms";
}

// Format fee in ETH
export function formatFee(eth: number): string {
    return "$" + eth.toFixed(4);
}

// Format reputation score
export function formatReputation(score: number): string {
    return score.toFixed(1) + "%";
}

// Get color class based on value (green/red)
export function getChangeColor(value: number): string {
    return value >= 0 ? "text-accent-green" : "text-accent-red";
}

// Get reputation color (green if >= 90%, red otherwise)
export function getReputationColor(score: number): string {
    return score >= 90 ? "text-accent-green" : score >= 70 ? "text-yellow-500" : "text-accent-red";
}

// Truncate address (0x1234...5678)
export function truncateAddress(address: string, chars: number = 4): string {
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Calculate time ago (e.g., "5m ago", "2h ago", "3d ago")
export function timeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
}

// Check if agent is "live" (active within last 5 minutes)
export function isLive(lastActiveTimestamp: number): boolean {
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - lastActiveTimestamp < fiveMinutes;
}
