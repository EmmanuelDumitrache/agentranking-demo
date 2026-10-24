"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  formatLandingStakeLabel,
  getLandingStakeTiers,
  type LandingTokenCard,
} from "@/components/public-site/landing-v3/landing-v3-mappers";
import {
  SolanaLogo,
  TelegramSocialIcon,
  VerifiedBadgeIcon,
  XSocialIcon,
  YoutubeSocialIcon,
} from "@/components/public-site/landing-v3/landing-v3-icons";
import { AgentRankingWordmark } from "@/components/layout/agent-ranking-wordmark";
import { PublicNavLink } from "@/components/public-site/public-nav-link";
import { RobinhoodChainIcon } from "@/components/shared/robinhood-chain-icon";
import { publicSiteAbsoluteUrl, publicSiteRoutes } from "@/lib/public-site/routes";
import { STAKE_PAGE_HREF } from "@/lib/stake-page-href";
import type { LandingRankedAgent } from "@/lib/public-site/home-types";
import type { PublicStakeSummary } from "@/lib/public-stake-summary";

const DEPLOY_ROWS = [
  { text: "init identity · ar://atlas-research", live: false },
  { text: "create wallet · 7xKq…9fQ2", live: false },
  { text: "route model · claude-opus-4.6", live: false },
  { text: "attach services · api, health", live: false },
  { text: "agent live · AR Score enabled", live: true },
] as const;

function isPublicStakeSummary(value: unknown): value is PublicStakeSummary {
  if (typeof value !== "object" || value === null) return false;
  const row = value as Partial<PublicStakeSummary>;
  return (
    typeof row.generatedAt === "string" &&
    (row.totalStakedAr === null || typeof row.totalStakedAr === "number") &&
    (row.activeStakers === null || typeof row.activeStakers === "number")
  );
}

function GraduationDiagram() {
  return (
    <div className="lm-diagram" aria-hidden>
      <svg className="lm-ring" viewBox="0 0 360 360" width="320" height="320">
        <circle
          cx="180"
          cy="180"
          r="179.5"
          fill="none"
          stroke="url(#ringDown)"
          strokeWidth="1"
        />
      </svg>
      <svg className="lm-grad" viewBox="0 0 380 220" fill="none">
        <path d="M20 200 L360 200" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <path
          d="M20 200 C 120 196, 210 150, 300 60 C 320 40, 340 26, 356 16"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="356" cy="16" r="5" fill="#ffffff" />
        <circle cx="356" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <text x="20" y="216" fill="rgba(255,255,255,0.35)" style={{ fontSize: 10, letterSpacing: "-0.02em" }}>
          LAUNCH
        </text>
        <text x="300" y="216" fill="rgba(255,255,255,0.35)" style={{ fontSize: 10, letterSpacing: "-0.02em" }}>
          GRADUATED
        </text>
      </svg>
    </div>
  );
}

function LaunchpadSection({ tokens }: { readonly tokens: readonly LandingTokenCard[] }) {
  return (
    <section className="lm-section" id="launchpad">
      <div className="lm-pane">
        <div className="lm-split">
          <div>
            <p className="lm-kicker">Launchpad</p>
            <h2 className="lm-h2">
              Tokenize
              <br />
              your agent
            </h2>
            <p className="lm-lead">
              Launch on Solana or Robinhood Chain. Earn from every trade — operators keep 70% of
              creator fees.
            </p>
            <div className="lm-pills">
              <span className="lm-tag">
                <SolanaLogo />
                Solana
              </span>
              <span className="lm-tag">
                <RobinhoodChainIcon className="h-4 w-4 rounded-[3px]" />
                Robinhood Chain
              </span>
            </div>
            <div className="lm-actions">
              <Link href={publicSiteRoutes.launchToken} className="lm-ghost">
                Launch a token
              </Link>
              <Link href={publicSiteRoutes.tokens} className="lm-ghost">
                View all tokens
              </Link>
            </div>
          </div>
          <GraduationDiagram />
        </div>
        <p className="lm-kicker" style={{ marginTop: 28 }}>
          Recently launched
        </p>
        <div className="lm-tokens">
          {tokens.map((token) => (
            <Link key={token.id} href={token.href} className="lm-token">
              <div className="lm-token__top">
                {token.imageUrl ? (
                  <Image
                    src={token.imageUrl}
                    alt=""
                    width={38}
                    height={38}
                    className="lm-token__mark"
                    unoptimized
                  />
                ) : (
                  <span className="lm-token__fallback">{token.initials}</span>
                )}
                <div>
                  <p className="lm-token__name">{token.name}</p>
                  <p className="lm-token__meta">
                    {token.symbol} · {token.chain}
                  </p>
                </div>
              </div>
              <div className="lm-token__stats">
                <span>
                  MCAP <strong>{token.mcap}</strong>
                </span>
                <span>
                  24H <strong>{token.vol}</strong>
                </span>
              </div>
              <div className="lm-bar">
                <span style={{ width: `${token.gradPct}%` }} />
              </div>
              <p className="lm-token__foot">{token.gradLabel}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function DiscoverySection({ ranked }: { readonly ranked: readonly LandingRankedAgent[] }) {
  return (
    <section className="lm-section" id="discovery">
      <div className="lm-pane lm-pane--card">
        <p className="lm-kicker">Discovery · AR Score</p>
        <h2 className="lm-h2">
          30+ chains.
          <br />
          One score.
        </h2>
        <p className="lm-lead">
          Activity, verification, and market signals distilled into a single AR Score.
        </p>
        <div className="lm-list">
          <div className="lm-list__head">
            <span>Top ranked agents</span>
            <Link href={publicSiteRoutes.ranking}>View all</Link>
          </div>
          {ranked.length === 0 ? (
            <p className="lm-lead" style={{ padding: "18px" }}>
              Native agents are indexing — browse the full directory while rankings populate.
            </p>
          ) : null}
          {ranked.map((agent) => (
            <Link key={`${agent.rank}-${agent.href}`} href={agent.href} className="lm-agent">
              <span className="lm-agent__rank">{agent.rank}</span>
              {agent.imageUrl ? (
                <Image
                  src={agent.imageUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="lm-agent__mark"
                  unoptimized
                />
              ) : (
                <span className="lm-agent__fallback">{agent.initials}</span>
              )}
              <span>
                <span className="lm-agent__name">
                  {agent.name}
                  {agent.verified ? <VerifiedBadgeIcon /> : null}
                </span>
                <span className="lm-agent__meta">
                  {agent.chains} · {agent.category}
                </span>
              </span>
              <span className="lm-agent__score">{agent.score}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function StakeSection({ summary }: { readonly summary: PublicStakeSummary | null }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [lockP, setLockP] = useState(0);
  const [lockLocked, setLockLocked] = useState(false);
  const [fetchedSummary, setFetchedSummary] = useState<PublicStakeSummary | null>(null);
  const liveSummary = fetchedSummary ?? summary;
  const tiers = getLandingStakeTiers();

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/public/staking-summary", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return;
        const payload: unknown = await response.json();
        if (isPublicStakeSummary(payload)) setFetchedSummary(payload);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const element = sectionRef.current;
      if (!element || lockLocked) return;
      const rect = element.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh - rect.top - vh * 0.16) / (vh * 0.42)));
      if (progress >= 1) {
        setLockLocked(true);
        setLockP(1);
      } else {
        setLockP(progress);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lockLocked]);

  const shackleY = -26 + 26 * (lockLocked ? 1 : lockP);

  return (
    <section className="lm-section" id="stake">
      <div className="lm-pane">
        <div className="lm-split">
          <div>
            <p className="lm-kicker">Staking</p>
            <h2 className="lm-h2">
              Stake $AR.
              <br />
              Earn the flywheel.
            </h2>
            <p className="lm-lead">
              Platform fees route to $AR buybacks and staking rewards. Four lock tiers — longer
              locks, larger share.
            </p>
            <div className="lm-rows">
              {tiers.map((tier) => (
                <div key={tier.id} className="lm-row">
                  <strong style={{ color: tier.color }}>{tier.label}</strong>
                  <span className="lm-bar" style={{ flex: 1, marginTop: 0 }}>
                    <span style={{ width: tier.width, background: tier.barColor }} />
                  </span>
                  <span style={{ color: tier.color, minWidth: 52, textAlign: "right" }}>
                    {tier.share}
                  </span>
                </div>
              ))}
            </div>
            <PublicNavLink href={STAKE_PAGE_HREF} className="lm-ghost">
              Stake $AR · Live now
            </PublicNavLink>
          </div>
          <div ref={sectionRef} className="lm-diagram">
            <svg className="lm-ring" viewBox="0 0 280 280" width="280" height="280">
              <circle cx="140" cy="140" r="139.5" fill="none" stroke="url(#ringUp)" strokeWidth="1" />
            </svg>
            <div className="lm-lock">
              <svg
                width="132"
                height="132"
                viewBox="0 0 132 132"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 6,
                  marginLeft: -66,
                  transform: `translateY(${shackleY}px)`,
                }}
              >
                <defs>
                  <linearGradient id="lm-shk" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#f2f3f6" />
                    <stop offset="0.45" stopColor="#c3c4cb" />
                    <stop offset="1" stopColor="#7f8088" />
                  </linearGradient>
                </defs>
                <path
                  d="M28 130 V62 a38 38 0 0 1 76 0 V130"
                  fill="none"
                  stroke="url(#lm-shk)"
                  strokeWidth="17"
                  strokeLinecap="round"
                />
              </svg>
              <div
                className="keyplate"
                style={{ left: 16, top: 118, width: 188, height: 138, borderRadius: 30 }}
              />
              <div
                className="keyplate__well"
                style={{ left: 32, top: 132, width: 156, height: 110, borderRadius: 24 }}
              />
            </div>
            <Link href={STAKE_PAGE_HREF} className="lm-kicker" style={{ position: "relative", opacity: lockLocked ? 0.85 : 0.4 }}>
              {formatLandingStakeLabel(liveSummary, lockLocked)}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeployTerminal({ models }: { readonly models: readonly string[] }) {
  const [deployStep, setDeployStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDeployStep((step) => (step + 1) % 9);
    }, 950);
    return () => window.clearInterval(timer);
  }, []);

  const progress = `${(Math.min(deployStep, 5) / 5) * 100}%`;

  return (
    <section className="lm-section" id="models">
      <div className="lm-pane">
        <div className="lm-split">
          <div>
            <p className="lm-kicker">Instant deployment</p>
            <h2 className="lm-h2">
              Deploy in
              <br />
              minutes.
              <br />
              300+ models.
            </h2>
            <p className="lm-lead">
              Identity, wallet, and services provisioned at creation — routed across a continuously
              updated model catalogue.
            </p>
            <Link href={publicSiteRoutes.launchAgentApp} className="lm-ghost">
              Create an agent
            </Link>
          </div>
          <div>
            <div className="lm-term">
              <div className="lm-term__bar">
                <span>deploy · new-agent</span>
                <span aria-hidden>●</span>
              </div>
              <div className="lm-term__body">
                {DEPLOY_ROWS.map((row, index) => {
                  const visible = deployStep > index;
                  return (
                    <div
                      key={row.text}
                      className="lm-term__row"
                      style={{
                        opacity: visible ? 1 : 0.18,
                        transform: visible ? "none" : "translateY(6px)",
                      }}
                    >
                      <span>{row.live ? "●" : "✓"}</span>
                      <span>{row.text}</span>
                    </div>
                  );
                })}
              </div>
              <div className="lm-term__progress">
                <span style={{ width: progress }} />
              </div>
            </div>
            <div className="lm-marquee-wrap" style={{ marginTop: 18 }}>
              <div className="lm-marquee">
                {models.map((model, index) => (
                  <span key={`${model}-${index}`}>{model}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="lm-section">
      <div className="lm-pane lm-cta">
        <p className="lm-kicker">Get started</p>
        <h2 className="lm-h2">
          Join the agent
          <br />
          economy
        </h2>
        <p className="lm-lead">Browse the index, deploy your first agent, or launch a token.</p>
        <div className="lm-cta__row">
          <Link href={publicSiteRoutes.ranking} className="lm-btn-white">
            Browse agents
          </Link>
          <Link href={publicSiteRoutes.launchAgentApp} className="lm-ghost" style={{ marginTop: 0 }}>
            Create an agent
          </Link>
          <Link href={publicSiteRoutes.launchToken} className="lm-ghost" style={{ marginTop: 0 }}>
            Launch a token
          </Link>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="lm-footer">
      <div className="lm-footer__row">
        <Link href="/" className="no-underline">
          <AgentRankingWordmark size="compact" textClassName="text-white/92" iconClassName="h-7 w-7" />
        </Link>
        <nav aria-label="Footer">
          {[
            ["Tokens", publicSiteRoutes.tokens],
            ["Agents", publicSiteRoutes.agents],
            ["Ranking", publicSiteRoutes.ranking],
            ["MCP", publicSiteRoutes.mcp],
            ["Launchpad", publicSiteRoutes.launchToken],
            ["Stake", STAKE_PAGE_HREF],
            ["Docs", publicSiteRoutes.docs],
            ["News", publicSiteRoutes.docs],
          ].map(([label, href]) => (
            <PublicNavLink key={label} href={href}>
              {label}
            </PublicNavLink>
          ))}
        </nav>
        <div className="lm-socials">
          <a href="https://x.com/agentranking" target="_blank" rel="noopener noreferrer" aria-label="X">
            <XSocialIcon />
          </a>
          <a
            href="https://www.youtube.com/@agentrankingio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <YoutubeSocialIcon />
          </a>
          <a href="https://t.me/agentrankingtg" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
            <TelegramSocialIcon />
          </a>
        </div>
      </div>
      <div className="lm-footer__legal">
        <p>© {year} AgentRanking</p>
        <p>
          Powered by <SolanaLogo /> Solana
        </p>
      </div>
    </footer>
  );
}

export function LandingMotionRest({
  tokens,
  ranked,
  models,
  summary,
}: {
  readonly tokens: readonly LandingTokenCard[];
  readonly ranked: readonly LandingRankedAgent[];
  readonly models: readonly string[];
  readonly summary: PublicStakeSummary | null;
}) {
  return (
    <div className="lm-rest">
      <DeployTerminal models={models} />
      <LaunchpadSection tokens={tokens} />
      <DiscoverySection ranked={ranked} />
      <StakeSection summary={summary} />
      <FinalCta />
      <LandingFooter />
    </div>
  );
}
