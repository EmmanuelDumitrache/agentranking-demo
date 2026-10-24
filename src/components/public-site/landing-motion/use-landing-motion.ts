"use client";

import { useEffect, type RefObject } from "react";

const DESIGN_WIDTH = 1685;
const DESIGN_HEIGHT = 960;
const DESKTOP_QUERY = "(min-width:1200px)";
// Hero -> features timeline. Kept short: the wheel is captured while it runs,
// so every extra millisecond here reads as lag when scrolling the page.
const EXIT_MS = 450;
const PILL_MS = 420;
const PILL_DELAY = 10;
const TITLE_AT = 380;
const TITLE_MS = 320;
const TOTAL_MS = 1500;
const EXIT_TRAVEL = -3150;
const EXIT_EXP = 9.1;
const EXIT_SCALE = 0.039;
const EXIT_SCALE_EXP = 0.62;
const HERO_PILL_X = 96.76;
const BACK_MS = 800;
const GLOBE_AT = 900;
const TOUCH_THRESHOLD = 12;
const WHEEL_IGNORE = 2;

const SCENE_PROPS = [
  "--scene-opacity",
  "--scene-y",
  "--scene-scale",
  "--pill-x",
  "--feature-scene-opacity",
  "--feature-scene-y",
  "--feature-scene-scale",
  "--title-opacity",
  "--security-base",
  "--security-art",
  "--transfer-base",
  "--transfer-art",
  "--staking-base",
  "--staking-rings",
  "--staking-card",
  "--staking-badge",
  "--staking-tag",
] as const;

function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function easeInExpo(t: number): number {
  return t <= 0 ? 0 : Math.pow(2, EXIT_EXP * (t - 1));
}

function pillEase(t: number): number {
  const x1 = 0.42;
  const y1 = 0.09;
  const x2 = 0;
  const y2 = 1;
  let x = t;
  for (let i = 0; i < 8; i += 1) {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const current = ((ax * x + bx) * x + cx) * x;
    const dx = (3 * ax * x + 2 * bx) * x + cx;
    if (Math.abs(dx) < 1e-6) break;
    x -= (current - t) / dx;
  }
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  return ((ay * x + by) * x + cy) * x;
}

function reveal(ms: number, start: number, dur: number): number {
  return 1 - Math.pow(1 - clamp01((ms - start) / dur), 2.2);
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isDesktop(): boolean {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function viewportSize(): { width: number; height: number } {
  const width = window.innerWidth;
  const height = window.visualViewport?.height ?? window.innerHeight;
  return { width, height };
}

function slotPinned(slot: HTMLElement | undefined, fill = 0.72): boolean {
  if (!slot) return false;
  const rect = slot.getBoundingClientRect();
  return rect.top > -32 && rect.top < 56 && rect.bottom >= window.innerHeight * fill;
}

function clearPaint(targets: HTMLElement[]): void {
  for (const target of targets) {
    for (const prop of SCENE_PROPS) {
      target.style.removeProperty(prop);
    }
  }
}

export function useLandingMotion(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const stage = root.querySelector<HTMLElement>("#stage");
    const hero = root.querySelector<HTMLElement>(".hero");
    const lifestyle = root.querySelector<HTMLElement>(".lifestyle");
    const heroScene = root.querySelector<HTMLElement>(".hero__scene");
    const lifestyleScene = root.querySelector<HTMLElement>(".lifestyle__scene");
    const heroVideo = root.querySelector<HTMLVideoElement>(".showcase__video");
    const globeVideo = root.querySelector<HTMLVideoElement>(".globe");
    const slots = Array.from(root.querySelectorAll<HTMLElement>(".panel-slot"));
    const paintTargets = [hero, lifestyle, heroScene, lifestyleScene, stage].filter(
      (node): node is HTMLElement => Boolean(node),
    );

    if (!stage || !hero || !lifestyle || !heroScene || !lifestyleScene) return;

    let running = false;
    let lockingScroll = false;
    let layoutRaf = 0;
    let tickRaf = 0;
    let touchStartY: number | null = null;

    const layout = () => {
      if (isDesktop()) {
        const { width, height } = viewportSize();
        const rawScale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
        const scale = Math.min(1, rawScale);
        const layoutWidth = Math.min(1720, Math.max(DESIGN_WIDTH, Math.round(width / scale)));
        const layoutHeight = Math.min(1020, Math.max(DESIGN_HEIGHT, Math.round(height / scale)));
        stage.style.setProperty("--scale", String(scale));
        stage.style.setProperty("--layout-width", `${layoutWidth}px`);
        stage.style.setProperty("--layout-height", `${layoutHeight}px`);
        return;
      }
      stage.style.removeProperty("--scale");
      stage.style.removeProperty("--layout-width");
      stage.style.removeProperty("--layout-height");
    };

    const scheduleLayout = () => {
      if (layoutRaf) return;
      layoutRaf = window.requestAnimationFrame(() => {
        layoutRaf = 0;
        layout();
      });
    };

    // The hero pills glide to the centred lifestyle nav; offsetWidth is the
    // unscaled layout width, so it matches the design-space travel distance.
    const heroNav = hero.querySelector<HTMLElement>(".navlinks");
    const pillTravel = () => {
      const scale = Number.parseFloat(getComputedStyle(stage).getPropertyValue("--scale")) || 1;
      const pillHalf = (heroNav?.offsetWidth ?? 0) / 2;
      return lifestyle.getBoundingClientRect().width / scale / 2 - pillHalf - HERO_PILL_X;
    };

    const paintHeroTransition = (ms: number) => {
      const u = clamp01(ms / EXIT_MS);
      heroScene.style.setProperty("--scene-opacity", String(1 - u));
      heroScene.style.setProperty("--scene-y", `${EXIT_TRAVEL * easeInExpo(u)}px`);
      heroScene.style.setProperty("--scene-scale", String(1 - EXIT_SCALE * Math.pow(u, EXIT_SCALE_EXP)));
      hero.style.setProperty(
        "--pill-x",
        `${pillTravel() * pillEase(clamp01((ms - PILL_DELAY) / PILL_MS))}px`,
      );
    };

    const paintFeatureEntrance = (ms: number) => {
      lifestyle.style.setProperty("--title-opacity", String(reveal(ms, TITLE_AT, TITLE_MS)));
      lifestyle.style.setProperty("--security-base", String(reveal(ms, 480, 260)));
      lifestyle.style.setProperty("--security-art", String(reveal(ms, 680, 260)));
      lifestyle.style.setProperty("--transfer-base", String(reveal(ms, 600, 260)));
      lifestyle.style.setProperty("--transfer-art", String(reveal(ms, 850, 280)));
      lifestyle.style.setProperty("--staking-base", String(reveal(ms, 820, 260)));
      lifestyle.style.setProperty("--staking-rings", String(reveal(ms, 1000, 260)));
      lifestyle.style.setProperty("--staking-card", String(reveal(ms, 1150, 240)));
      lifestyle.style.setProperty("--staking-badge", String(reveal(ms, 1300, 180)));
      lifestyle.style.setProperty("--staking-tag", String(reveal(ms, 1380, 120)));
    };

    const paintFeatureSceneExit = (u: number) => {
      const t = clamp01(u);
      lifestyleScene.style.setProperty("--feature-scene-opacity", String(1 - t));
      lifestyleScene.style.setProperty("--feature-scene-y", `${-EXIT_TRAVEL * easeInExpo(t)}px`);
      lifestyleScene.style.setProperty(
        "--feature-scene-scale",
        String(1 - EXIT_SCALE * Math.pow(t, EXIT_SCALE_EXP)),
      );
    };

    const resetGlobe = () => {
      lifestyleScene.classList.remove("has-transfer-loop");
      if (!globeVideo) return;
      globeVideo.pause();
      globeVideo.currentTime = 0;
    };

    const startGlobe = () => {
      lifestyleScene.classList.add("has-transfer-loop");
      if (!globeVideo) return;
      void globeVideo.play().catch(() => undefined);
    };

    const playHeroVideo = () => {
      if (!heroVideo) return;
      if (prefersReducedMotion()) {
        heroVideo.pause();
        return;
      }
      void heroVideo.play().catch(() => undefined);
    };

    const syncVideos = () => {
      playHeroVideo();
      if (prefersReducedMotion()) {
        resetGlobe();
        return;
      }
      if (isDesktop()) {
        resetGlobe();
        return;
      }
      startGlobe();
    };

    const jumpToSlot = (index: number) => {
      const slot = slots[index];
      if (!slot) return;
      const previous = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      slot.scrollIntoView({ block: "start" });
      document.documentElement.style.scrollBehavior = previous;
    };

    const stopCinematic = (forward: boolean) => {
      if (tickRaf) {
        window.cancelAnimationFrame(tickRaf);
        tickRaf = 0;
      }
      clearPaint(paintTargets);
      document.body.classList.remove("is-transitioning");
      running = false;
      lockingScroll = false;
      if (forward) startGlobe();
      else resetGlobe();
    };

    const play = (forward: boolean) => {
      if (running) return;
      if (!isDesktop() || prefersReducedMotion() || slots.length !== 2) return;
      if (forward && !slotPinned(slots[0], 0.8)) return;
      if (!forward && !slotPinned(slots[1], 0.7)) return;

      running = true;
      lockingScroll = true;
      document.body.classList.add("is-transitioning");
      const duration = forward ? TOTAL_MS : BACK_MS;
      const started = performance.now();
      let globeStarted = false;
      let jumped = false;

      const tick = (now: number) => {
        const ms = now - started;
        if (forward) {
          paintHeroTransition(ms);
          paintFeatureEntrance(ms);
          if (ms >= EXIT_MS && !jumped) {
            jumped = true;
            jumpToSlot(1);
            lockingScroll = false;
          }
          if (ms >= GLOBE_AT && !globeStarted) {
            globeStarted = true;
            startGlobe();
          }
        } else if (ms < EXIT_MS) {
          paintHeroTransition(EXIT_MS);
          paintFeatureSceneExit(ms / EXIT_MS);
        } else {
          if (!jumped) {
            jumped = true;
            jumpToSlot(0);
            lockingScroll = false;
          }
          paintHeroTransition(EXIT_MS - (ms - EXIT_MS));
        }

        if (ms < duration) {
          tickRaf = window.requestAnimationFrame(tick);
          return;
        }

        clearPaint(paintTargets);
        document.body.classList.remove("is-transitioning");
        running = false;
        lockingScroll = false;
        tickRaf = 0;
        if (!forward) resetGlobe();
      };

      tickRaf = window.requestAnimationFrame(tick);
    };

    const cinematicEnabled = () => isDesktop() && !prefersReducedMotion() && slots.length === 2;

    const onWheel = (event: WheelEvent) => {
      if (!cinematicEnabled()) return;
      if (Math.abs(event.deltaY) < WHEEL_IGNORE) return;
      if (lockingScroll) {
        event.preventDefault();
        return;
      }
      if (running) {
        stopCinematic(event.deltaY > 0);
        return;
      }
      if (event.deltaY > 0 && slotPinned(slots[0], 0.8)) {
        event.preventDefault();
        play(true);
      } else if (event.deltaY < 0 && slotPinned(slots[1], 0.7)) {
        event.preventDefault();
        play(false);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY == null) return;
      if (!cinematicEnabled()) return;
      const currentY = event.touches[0]?.clientY;
      if (currentY == null) return;
      const delta = touchStartY - currentY;
      if (Math.abs(delta) < TOUCH_THRESHOLD) return;
      if (lockingScroll) {
        event.preventDefault();
        return;
      }
      if (running) {
        stopCinematic(delta > 0);
        touchStartY = null;
        return;
      }
      if (delta > 0 && slotPinned(slots[0], 0.8)) {
        event.preventDefault();
        play(true);
      } else if (delta < 0 && slotPinned(slots[1], 0.7)) {
        event.preventDefault();
        play(false);
      }
      touchStartY = null;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!cinematicEnabled()) return;
      const forwardKeys = ["PageDown", "ArrowDown"];
      const backwardKeys = ["PageUp", "ArrowUp"];
      if (![...forwardKeys, ...backwardKeys].includes(event.key)) return;
      if (lockingScroll) {
        event.preventDefault();
        return;
      }
      if (running) {
        stopCinematic(forwardKeys.includes(event.key));
        return;
      }
      if (forwardKeys.includes(event.key) && slotPinned(slots[0], 0.8)) {
        event.preventDefault();
        play(true);
      } else if (backwardKeys.includes(event.key) && slotPinned(slots[1], 0.7)) {
        event.preventDefault();
        play(false);
      }
    };

    const onHashChange = () => {
      clearPaint(paintTargets);
      if (window.location.hash === "#features") {
        resetGlobe();
        startGlobe();
      }
    };

    const onReducedMotionChange = () => {
      syncVideos();
    };

    const onDesktopChange = () => {
      syncVideos();
      scheduleLayout();
    };

    const setActivePills = (href: string) => {
      root.querySelectorAll<HTMLElement>(".pill").forEach((pill) => {
        const match = pill.getAttribute("href") === href;
        pill.classList.toggle("is-active", match);
        if (match) pill.setAttribute("aria-current", "true");
        else pill.removeAttribute("aria-current");
      });
    };

    const closeMenu = (menu: HTMLElement, burger: HTMLElement | null, restoreFocus: boolean) => {
      menu.classList.remove("is-open");
      if (!burger) return;
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu");
      if (restoreFocus) burger.focus();
    };

    const closeAllMenus = (restoreFocus = false) => {
      root.querySelectorAll<HTMLElement>(".navmenu.is-open").forEach((menu) => {
        const burger = root.querySelector<HTMLElement>(`.navburger[aria-controls="${menu.id}"]`);
        closeMenu(menu, burger, restoreFocus);
      });
    };

    const onBurgerClick = (event: Event) => {
      const burger = event.currentTarget as HTMLElement;
      const id = burger.getAttribute("aria-controls");
      if (!id) return;
      const menu = root.querySelector<HTMLElement>(`#${id}`);
      if (!menu) return;
      const open = !menu.classList.contains("is-open");
      closeAllMenus();
      if (!open) return;
      menu.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Close menu");
      window.requestAnimationFrame(() => {
        menu.querySelector<HTMLElement>("a")?.focus();
      });
    };

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (root.querySelector(".navmenu.is-open") && !root.contains(target)) {
        closeAllMenus();
        return;
      }
      const openMenu = root.querySelector<HTMLElement>(".navmenu.is-open");
      if (!openMenu) return;
      const burger = root.querySelector<HTMLElement>(`.navburger[aria-controls="${openMenu.id}"]`);
      if (openMenu.contains(target) || burger?.contains(target)) return;
      closeAllMenus();
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (!root.querySelector(".navmenu.is-open")) return;
      closeAllMenus(true);
    };

    const onViewportBand = () => {
      if (window.matchMedia("(max-width:1199.98px)").matches) return;
      closeAllMenus();
    };

    const onPillClick = (event: Event) => {
      const pill = event.currentTarget as HTMLElement;
      const href = pill.getAttribute("href");
      if (!href) return;
      setActivePills(href);
      closeAllMenus();
    };

    layout();
    syncVideos();

    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopMq = window.matchMedia(DESKTOP_QUERY);
    const compactBandMq = window.matchMedia("(max-width:1199.98px)");

    window.addEventListener("resize", scheduleLayout);
    window.addEventListener("orientationchange", scheduleLayout);
    window.visualViewport?.addEventListener("resize", scheduleLayout);
    window.addEventListener("load", scheduleLayout);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onDocumentClick);
    window.addEventListener("keydown", onEscape);
    reducedMq.addEventListener("change", onReducedMotionChange);
    desktopMq.addEventListener("change", onDesktopChange);
    compactBandMq.addEventListener("change", onViewportBand);

    const burgers = Array.from(root.querySelectorAll<HTMLElement>(".navburger"));
    const pills = Array.from(root.querySelectorAll<HTMLElement>(".pill"));
    burgers.forEach((burger) => burger.addEventListener("click", onBurgerClick));
    pills.forEach((pill) => pill.addEventListener("click", onPillClick));

    return () => {
      window.removeEventListener("resize", scheduleLayout);
      window.removeEventListener("orientationchange", scheduleLayout);
      window.visualViewport?.removeEventListener("resize", scheduleLayout);
      window.removeEventListener("load", scheduleLayout);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onDocumentClick);
      window.removeEventListener("keydown", onEscape);
      reducedMq.removeEventListener("change", onReducedMotionChange);
      desktopMq.removeEventListener("change", onDesktopChange);
      compactBandMq.removeEventListener("change", onViewportBand);
      burgers.forEach((burger) => burger.removeEventListener("click", onBurgerClick));
      pills.forEach((pill) => pill.removeEventListener("click", onPillClick));
      document.body.classList.remove("is-transitioning");
      if (layoutRaf) window.cancelAnimationFrame(layoutRaf);
      if (tickRaf) window.cancelAnimationFrame(tickRaf);
    };
  }, [rootRef]);
}
