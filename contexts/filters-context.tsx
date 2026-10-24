"use client";

import * as React from "react";

export type AgentFilters = {
  chain: string | null;
  protocol: string | null;
  trustMethod: string | null;
  skill: string | null;
  domain: string | null;
  hasX402: boolean | null;
};

type FiltersContextValue = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filters: AgentFilters;
  setFilters: React.Dispatch<React.SetStateAction<AgentFilters>>;
  clearAllFilters: () => void;
};

const defaultFilters: AgentFilters = {
  chain: null,
  protocol: null,
  trustMethod: null,
  skill: null,
  domain: null,
  hasX402: null,
};

const FiltersContext = React.createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState<AgentFilters>(defaultFilters);

  const clearAllFilters = React.useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const value = React.useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      filters,
      setFilters,
      clearAllFilters,
    }),
    [searchQuery, filters, clearAllFilters]
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = React.useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used within FiltersProvider");
  return ctx;
}
