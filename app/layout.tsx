import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/layout/header";
import { FiltersProvider } from "@/contexts/filters-context";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "8004scanner - ERC-8004 AI Agent Discovery",
  description: "Discover and analyze ERC-8004 AI Agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
        <FiltersProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col min-h-screen overflow-x-hidden">
              <Header />
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </FiltersProvider>
        </Providers>
      </body>
    </html>
  );
}
