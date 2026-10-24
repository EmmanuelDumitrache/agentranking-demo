import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthWaveBackground } from "@/components/auth/auth-wave-background";
import { DemoLoginForm } from "@/components/auth/demo-login-form";

export const metadata: Metadata = {
  title: "Sign In — AgentRanking Dashboard",
  description: "Sign in to your AgentRanking creator workspace.",
};

export default function LoginPage() {
  return (
    <div className="dark relative flex min-h-screen flex-col items-center justify-center bg-[#0f0f0f] px-4 py-12 text-[#f1f1f1]">
      <AuthWaveBackground />
      <main id="main" className="relative z-10 w-full max-w-[400px]">
        <Suspense fallback={<div className="h-[520px] rounded-2xl border border-[#303030] bg-[#181818]" />}>
          <DemoLoginForm />
        </Suspense>
      </main>
    </div>
  );
}
