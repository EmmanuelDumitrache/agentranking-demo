"use client";

import Link from "next/link";
import { useRef } from "react";
import { MOTION_ASSETS } from "@/components/public-site/landing-motion/assets";
import { LandingMotionTopbar } from "@/components/public-site/landing-motion/landing-motion-chrome";
import { LandingMotionRest } from "@/components/public-site/landing-motion/landing-motion-rest";
import { StakingLockMark } from "@/components/public-site/landing-motion/staking-lock-mark";
import { useLandingMotion } from "@/components/public-site/landing-motion/use-landing-motion";
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

const SHOWCASE_ROWS = 5;

function ShowcaseLeaderboard({ ranked }: { readonly ranked: readonly LandingRankedAgent[] }) {
  // Lead with agents that already have an AR Score; unscored agents only fill gaps.
  const scored = ranked.filter((agent) => agent.score !== "—");
  const unscored = ranked.filter((agent) => agent.score === "—");
  const rows = [...scored, ...unscored].slice(0, SHOWCASE_ROWS);
  return (
    <Link className="showcase__board" href={publicSiteRoutes.ranking} aria-label="View the full AR Score ranking">
      <span className="showcase__board-head">
        <img src={MOTION_ASSETS.mark} alt="" />
        AR Score · Top agents
      </span>
      <span className="showcase__board-rows">
        {rows.length === 0 ? (
          <span className="showcase__board-empty">Rankings populate as agents are indexed.</span>
        ) : null}
        {rows.map((agent, index) => (
          <span key={agent.href} className="showcase__board-row">
            <span className="showcase__board-rank">{String(index + 1).padStart(2, "0")}</span>
            <span className="showcase__board-name">{agent.name}</span>
            <span className="showcase__board-score">{agent.score}</span>
          </span>
        ))}
      </span>
      <span className="showcase__board-foot">View full ranking →</span>
    </Link>
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
            <stop offset="1" stopColor="#fff" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id="ringUp" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0.5436" stopColor="#999" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.14" />
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
                  <h1 className="hero__title">
                    <span className="hero__line">The</span>
                    <span className="hero__line">Trust</span>
                    <span className="hero__line">Layer</span>
                  </h1>
                  <p className="hero__lede">
                    Verify, deploy, and tokenize AI agents
                    <br />
                    ranked across 30+ chains
                  </p>
                  <div className="hero__stats" role="list">
                    {heroStats.map((stat) => (
                      <span key={stat.label} className="hero__stat" role="listitem">
                        <strong>{stat.value}</strong> {stat.label}
                      </span>
                    ))}
                  </div>
                  <Link className="cta" href={publicSiteRoutes.agents}>
                    <span className="cta__label">Explore Agents</span>
                    <span className="cta__arrow">
                      <img src={MOTION_ASSETS.arrowUp} alt="" />
                    </span>
                  </Link>
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
                  <p className="showcase__eyebrow">Live agent ranking</p>
                  <ShowcaseLeaderboard ranked={data.rankedAgents} />
                  <div className="showcase__copy">
                    <h2 className="showcase__title">
                      Global
                      <br />
                      Ranking
                    </h2>
                    <p className="showcase__sub">
                      One trust score for every
                      <br />
                      indexed on-chain agent
                    </p>
                  </div>
                </div>
              </div>
              <LandingMotionTopbar menuId="nav-menu-hero" navLabel="Primary" />
            </section>
          </div>

          <div className="panel-slot">
            <section className="panel lifestyle" id="features">
              <div className="lifestyle__scene">
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
                          <div className="keyplate" />
                          <div className="keyplate__well" />
                          <img className="keyplate__key" src={MOTION_ASSETS.key} alt="" />
                          <img className="keyplate__key" src={MOTION_ASSETS.key} alt="" />
                          <span className="ltag ltag--soa">State-of-the-art</span>
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
                          <Ring className="lring--orbit-inner" size={265} href="#ringDown" />
                          <StakingLockMark className="orbit__lock" />
                          <div className="orbit__badge" />
                          <div className="orbit__badge-inner" />
                          <img className="orbit__bolt" src={MOTION_ASSETS.bolt} alt="" />
                          <span className="ltag ltag--yield">4 lock tiers</span>
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
