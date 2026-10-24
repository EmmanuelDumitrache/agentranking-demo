"use client";

import type { ReactNode } from "react";

export function SessionProvider({ children }: { readonly children: ReactNode }) {
  return <>{children}</>;
}
