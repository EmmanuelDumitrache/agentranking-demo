"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AgentRankingWordmark } from "@/components/layout/agent-ranking-wordmark";
import { showToast } from "@/components/ui/toast-simple";
import { normalizeAppCallbackPath } from "@/lib/app-auth-routes";

function GoogleIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function XIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SolanaIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M4.2 17.6c.2-.2.5-.3.8-.3h15.3c.6 0 .9.7.5 1.1l-2.6 2.6c-.2.2-.5.3-.8.3H2.1c-.6 0-.9-.7-.5-1.1l2.6-2.6zm0-11.2c.2-.2.5-.3.8-.3h15.3c.6 0 .9.7.5 1.1l-2.6 2.6c-.2.2-.5.3-.8.3H2.1c-.6 0-.9-.7-.5-1.1l2.6-2.6zm15.6 5.3c-.2-.2-.5-.3-.8-.3H3.7c-.6 0-.9.7-.5 1.1l2.6 2.6c.2.2.5.3.8.3h15.3c.6 0 .9-.7.5-1.1l-2.6-2.6z" />
    </svg>
  );
}

function EthereumIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 1.75 5.75 12.25 12 16l6.25-3.75L12 1.75ZM5.75 13.5 12 22.25l6.25-8.75L12 17.25 5.75 13.5Z" />
    </svg>
  );
}

export function DemoLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = normalizeAppCallbackPath(searchParams.get("callbackUrl"));

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("800420");
  const [busyMethod, setBusyMethod] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("public-site", "light");
    root.classList.add("agentranking-app", "dark");
    root.style.colorScheme = "dark";
  }, []);

  const completeSignIn = (method: string, displayName: string) => {
    setBusyMethod(method);
    try {
      window.localStorage.setItem(
        "agentranking_demo_session_v1",
        JSON.stringify({
          method,
          displayName,
          signedInAt: new Date().toISOString(),
        }),
      );
    } catch {
      // Ignore storage errors
    }
    showToast(`Signed in as ${displayName}`, "success");
    setTimeout(() => {
      router.push(callbackUrl);
    }, 220);
  };

  const handleEmailSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    if (!otpSent) {
      setOtpSent(true);
      showToast(`Demo verification code 800420 prepared for ${trimmed}`, "info");
      return;
    }
    completeSignIn("email", trimmed.split("@")[0] || "Tokyo Operator");
  };

  const busy = busyMethod !== null;

  return (
    <div className="w-full">
      <div className="ui-auth-youtube border border-[#303030] bg-[#181818] p-6 sm:p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Link href="/" aria-label="Back to AgentRanking homepage">
              <AgentRankingWordmark size="auth" />
            </Link>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#f1f1f1]">
            Agent Ranking Dashboard
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-[#aaa]">
            Create agents, launch tokens, and manage on-chain revenue from one workspace
          </p>
        </div>

        <div className="space-y-2.5">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full justify-center gap-2.5 rounded-full border-emerald-500/40 bg-emerald-500/10 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20 hover:text-white"
            disabled={busy}
            onClick={() => completeSignIn("demo", "Manny · Tokyo Operator")}
          >
            {busyMethod === "demo" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Sparkles className="size-4 text-emerald-400" aria-hidden />
            )}
            Continue as demo user (Instant Access)
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full justify-center gap-2.5 rounded-full border-[#303030] bg-[#212121] text-sm font-medium text-[#f1f1f1] hover:bg-[#272727] hover:text-white"
            disabled={busy}
            onClick={() => completeSignIn("google", "manny.tokyo@agentranking.io")}
          >
            {busyMethod === "google" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <GoogleIcon className="size-4" />
            )}
            Continue with Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full justify-center gap-2.5 rounded-full border-[#303030] bg-[#212121] text-sm font-medium text-[#f1f1f1] hover:bg-[#272727] hover:text-white"
            disabled={busy}
            onClick={() => completeSignIn("twitter", "@EmmanuelTokyo")}
          >
            {busyMethod === "twitter" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <XIcon className="size-4" />
            )}
            Continue with X
          </Button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-[#303030]" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-[#aaa]">
              or
            </span>
            <div className="h-px flex-1 bg-[#303030]" />
          </div>

          {!otpSent ? (
            <form onSubmit={handleEmailSubmit} className="space-y-2.5">
              <div>
                <Label htmlFor="login-email" className="sr-only">
                  Email address
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={busy}
                  required
                  className="h-11 border-[#303030] bg-[#0f0f0f] text-[#f1f1f1] placeholder:text-[#717171]"
                />
              </div>
              <Button
                type="submit"
                className="h-11 w-full justify-center gap-2 rounded-full bg-[#f1f1f1] text-sm font-semibold text-[#0f0f0f] hover:bg-white"
                disabled={busy || !email.trim()}
              >
                <Mail className="size-4" aria-hidden />
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#f1f1f1]">Check your email</p>
                <p className="text-xs leading-relaxed text-[#aaa]">
                  Demo verification code prefilled for{" "}
                  <span className="font-medium text-[#f1f1f1]">{email.trim()}</span>.
                </p>
              </div>
              <div>
                <Label htmlFor="login-otp" className="sr-only">
                  Verification code
                </Label>
                <Input
                  id="login-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(event) => setOtpCode(event.target.value)}
                  className="h-11 border-[#303030] bg-[#0f0f0f] text-center font-mono text-lg tracking-[0.35em] text-[#f1f1f1]"
                />
              </div>
              <Button
                type="submit"
                className="h-11 w-full justify-center gap-2 rounded-full bg-[#f1f1f1] text-sm font-semibold text-[#0f0f0f] hover:bg-white"
                disabled={busy}
              >
                {busyMethod === "email" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : null}
                Verify & Sign In
              </Button>
            </form>
          )}

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-[#303030]" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-[#aaa]">
              or
            </span>
            <div className="h-px flex-1 bg-[#303030]" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full justify-center gap-2.5 rounded-full border-[#303030] bg-[#212121] text-sm font-medium text-[#f1f1f1] hover:bg-[#272727] hover:text-white"
            disabled={busy}
            onClick={() => completeSignIn("solana", "92eX…PUmP (Solana)")}
          >
            {busyMethod === "solana" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <SolanaIcon className="size-4" />
            )}
            Continue with wallet
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full justify-center gap-2.5 rounded-full border-[#303030] bg-[#212121] text-sm font-medium text-[#f1f1f1] hover:bg-[#272727] hover:text-white"
            disabled={busy}
            onClick={() => completeSignIn("evm", "0x71C9…292e (Base)")}
          >
            {busyMethod === "evm" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <EthereumIcon className="size-4" />
            )}
            Continue with EVM wallet
          </Button>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-[#717171]">
          By continuing, you agree to the{" "}
          <Link href="/terms" className="underline hover:text-[#aaa]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-[#aaa]">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
