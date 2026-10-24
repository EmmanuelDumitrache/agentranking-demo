"use client";

import Link from "next/link";
import { useRef } from "react";
import { MOTION_ASSETS } from "@/components/public-site/landing-motion/assets";
import { LandingMotionTopbar } from "@/components/public-site/landing-motion/landing-motion-chrome";
import { LandingMotionRest } from "@/components/public-site/landing-motion/landing-motion-rest";
import { StakingLockMark } from "@/components/public-site/landing-motion/staking-lock-mark";
import { useLandingMotion } from "@/components/public-site/landing-motion/use-landing-motion";
import { VerifiedBadgeIcon } from "@/components/public-site/landing-v3/landing-v3-icons";
import {
  buildLandingHeroStats,
  buildLandingModelMarquee,
  mapLandingTokens,
} from "@/components/public-site/landing-v3/landing-v3-mappers";
import { publicSiteRoutes } from "@/lib/public-site/routes";
import type { LandingRankedAgent, PublicSiteHomeData } from "@/lib/public-site/home-types";
import type { PublicStakeSummary } from "@/lib/public-stake-summary";

type Props = {
  readonly data: PublicSiteHomeData;
  readonly initialStakeSummary: PublicStakeSummary | null;
  readonly modelCount?: number;
};

function Ring({
  className,
  size,
  href,
}: {
  readonly className: string;
  readonly size: number;
  readonly href: "#ringDown" | "#ringUp";
}) {
  return (
    <svg className={`lring ${className}`} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 0.5} fill="none" stroke={`url(${href})`} strokeWidth="1" />
    </svg>
  );
}

const SHOWCASE_ROWS = 6;

function ShowcaseLeaderboard({ ranked }: { readonly ranked: readonly LandingRankedAgent[] }) {
  const scored = ranked.filter((agent) => agent.score !== "—");
  const unscored = ranked.filter((agent) => agent.score === "—");
  const rows = [...scored, ...unscored].slice(0, SHOWCASE_ROWS);
  return (
    <div className="showcase__board" role="region" aria-label="Top ranked AI agents">
      <div className="showcase__board-head">
        <span className="showcase__board-head-left">
          <img src={MOTION_ASSETS.mark} alt="" />
          <span>AR Score · Live Leaderboard</span>
        </span>
        <span className="showcase__board-live-pill">
          <span className="showcase__board-live-dot" />
          Real-Time Index
        </span>
      </div>
      <div className="showcase__board-rows">
        {rows.length === 0 ? (
          <span className="showcase__board-empty">Rankings populate as agents are indexed.</span>
        ) : null}
        {rows.map((agent, index) => (
          <Link key={agent.href} href={agent.href} className="showcase__board-row">
            <span className="showcase__board-rank">{String(index + 1).padStart(2, "0")}</span>
            {agent.imageUrl ? (
              <img
                src={agent.imageUrl}
                alt={agent.name}
                className="showcase__board-avatar"
              />
            ) : (
              <span className="showcase__board-avatar showcase__board-avatar--fallback">
                {agent.initials}
              </span>
            )}
            <span className="showcase__board-info">
              <span className="showcase__board-name-row">
                <span className="showcase__board-name">{agent.name}</span>
                {agent.verified ? <VerifiedBadgeIcon /> : null}
              </span>
              <span className="showcase__board-meta">
                <span className="showcase__board-chain">{agent.chains}</span>
                <span className="showcase__board-sep">·</span>
                <span className="showcase__board-cat">{agent.category}</span>
              </span>
            </span>
            <span className="showcase__board-score-wrap">
              <span className="showcase__board-score-label">AR SCORE</span>
              <span className="showcase__board-score">{agent.score}</span>
            </span>
          </Link>
        ))}
      </div>
      <Link className="showcase__board-foot" href={publicSiteRoutes.ranking}>
        <span>Explore all 119,420+ indexed agents</span>
        <span>View full ranking →</span>
      </Link>
    </div>
  );
}

export function LandingMotionPage({ data, initialStakeSummary, modelCount = 300 }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useLandingMotion(rootRef);
  const heroStats = buildLandingHeroStats(data, modelCount);
  const tokens = mapLandingTokens(data.tokens);
  const models = buildLandingModelMarquee(modelCount);

  return (
    <div ref={rootRef} className="landing-motion">
      <svg className="svg-defs" aria-hidden="true" width="0" height="0">
        <defs>
          <linearGradient id="ringDown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.5436" stopColor="#999" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="ringUp" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0.5436" stopColor="#999" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.18" />
          </linearGradient>
        </defs>
      </svg>

      <div className="viewport" id="viewport">
        <div className="stage" id="stage">
          <div className="panel-slot">
            <section className="panel hero" id="top">
              <div className="hero__scene">
                <div className="hero__pane hero__pane--left" />
                <div className="hero__content">
                  <div className="hero__eyebrow-pill">
                    <span className="hero__eyebrow-dot" />
                    <span>ERC-8004 · SOLANA SAP · MCP DIRECTORY</span>
                  </div>
                  <h1 className="hero__title">
                    <span className="hero__line">The Trust</span>
                    <span className="hero__line">Layer For</span>
                    <span className="hero__line hero__line--muted">AI Agents</span>
                  </h1>
                  <p className="hero__lede">
                    Verify, deploy, and tokenize autonomous AI agents ranked across 30+ chains with
                    on-chain reputation, x402 payments, and MCP tool discovery.
                  </p>
                  <div className="hero__stats" role="list">
                    {heroStats.map((stat) => (
                      <div key={stat.label} className="hero__stat-card" role="listitem">
                        <strong className="hero__stat-value">{stat.value}</strong>
                        <span className="hero__stat-label">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="hero__actions">
                    <Link className="cta" href={publicSiteRoutes.agents}>
                      <span className="cta__label">Explore Agents</span>
                      <span className="cta__arrow">
                        <img src={MOTION_ASSETS.arrowUp} alt="" />
                      </span>
                    </Link>
                    <Link className="hero__secondary-cta" href={publicSiteRoutes.launchApp}>
                      Open Creator Studio →
                    </Link>
                  </div>
                </div>
                <div className="hero__pane hero__pane--right showcase" id="leaderboard">
                  <video
                    className="showcase__video"
                    src={MOTION_ASSETS.heroVideo}
                    poster={MOTION_ASSETS.heroPoster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                  <div className="showcase__inner">
                    <ShowcaseLeaderboard ranked={data.rankedAgents} />
                    <div className="showcase__copy">
                      <h2 className="showcase__title">Global Agent Ranking</h2>
                      <p className="showcase__sub">
                        One unified trust score combining on-chain identity, MCP telemetry &amp;
                        market liquidity
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <LandingMotionTopbar menuId="nav-menu-hero" navLabel="Primary" />
            </section>
          </div>

          <div className="panel-slot">
            <section className="panel lifestyle" id="features">
              <div className="lifestyle__scene has-transfer-loop">
                <h2 className="lifestyle__title">
                  Your Agent
                  <br />
                  Stack
                </h2>
                <div className="lifestyle__grid">
                  <div className="lcard-slot">
                    <article className="lcard lcard--security" id="verification">
                      <div className="lcard__surface" />
                      <Link
                        className="lcard__link"
                        href={`${publicSiteRoutes.docs}/claiming-and-verification`}
                        aria-label="Read how agent verification works"
                      />
                      <div className="lcard__content">
                        <div className="lcard__art">
                          <Ring className="lring--security" size={481} href="#ringDown" />
                          <div className="security-node-path">
                            <span className="node-dot" />
                          </div>
                          <div className="security-node-path security-node-path--reverse">
                            <span className="node-dot" />
                          </div>
                          <div className="keyplate" />
                          <div className="keyplate__well" />
                          <img className="keyplate__key" src={MOTION_ASSETS.key} alt="" />
                          <img className="keyplate__key" src={MOTION_ASSETS.key} alt="" />
                          <span className="ltag ltag--soa">State-of-the-art</span>
                          <span className="ltag ltag--erc8004">ERC-8004 · KYC</span>
                        </div>
                        <h3 className="lcard__title">
                          Verified
                          <br />
                          Identity
                        </h3>
                        <p className="lcard__desc">
                          KYC-backed operators. Full on-chain
                          <br />
                          history baked into AR Score.
                        </p>
                      </div>
                    </article>
                  </div>

                  <div className="lcard-slot">
                    <article className="lcard lcard--transfers" id="deploy">
                      <div className="lcard__surface" />
                      <Link
                        className="lcard__link"
                        href={publicSiteRoutes.launchAgentApp}
                        aria-label="Create an agent"
                      />
                      <div className="lcard__content">
                        <div className="lcard__art">
                          <Ring className="lring--transfers" size={481} href="#ringUp" />
                          <video
                            className="globe"
                            src={MOTION_ASSETS.globeVideo}
                            poster={MOTION_ASSETS.globePoster}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            tabIndex={-1}
                            aria-hidden="true"
                          />
                          <div className="globe-fade" />
                          <span className="ltag ltag--wallet">Any wallet</span>
                          <span className="ltag ltag--bank">300+ models</span>
                          <div className="transfer-node-path">
                            <span className="node-dot" />
                          </div>
                        </div>
                        <h3 className="lcard__title">
                          Instant
                          <br />
                          Deploy
                        </h3>
                        <p className="lcard__desc">
                          Identity, wallet, and 300+ models
                          <br />
                          live in minutes
                        </p>
                      </div>
                    </article>
                  </div>

                  <div className="lcard-slot">
                    <article className="lcard lcard--staking" id="staking">
                      <div className="lcard__surface" />
                      <Link className="lcard__link" href={publicSiteRoutes.stake} aria-label="Stake $AR" />
                      <div className="lcard__content">
                        <div className="lcard__art">
                          <Ring className="lring--orbit-outer" size={505} href="#ringDown" />
                          <Ring className="lring--orbit-inner" size={265} href="#ringUp" />
                          <div className="staking-node-path">
                            <span className="node-dot" />
                          </div>
                          <div className="staking-node-path staking-node-path--inner">
                            <span className="node-dot" />
                          </div>
                          <StakingLockMark className="orbit__lock" />
                          <div className="orbit__badge" />
                          <div className="orbit__badge-inner" />
                          <img className="orbit__bolt" src={MOTION_ASSETS.bolt} alt="" />
                          <span className="ltag ltag--yield">4 lock tiers</span>
                          <span className="ltag ltag--buyback">$AR Buybacks</span>
                        </div>
                        <h3 className="lcard__title">
                          Automated
                          <br />
                          Staking
                        </h3>
                        <p className="lcard__desc">
                          Platform fees route to $AR buybacks
                          <br />
                          while balances stay ready
                        </p>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
              <LandingMotionTopbar menuId="nav-menu-lifestyle" navLabel="Sections" />
            </section>
          </div>
        </div>
      </div>

      <LandingMotionRest
        tokens={tokens}
        ranked={data.rankedAgents}
        models={models}
        summary={initialStakeSummary}
      />
    </div>
  );
}
