import Link from "next/link";
import { MOTION_ASSETS } from "@/components/public-site/landing-motion/assets";
import { appLoginUrl } from "@/lib/app-auth-routes";
import { buildPublicSiteNavLinks, publicSiteRoutes } from "@/lib/public-site/routes";
import { isPublicNavDropdown, type PublicNavLink } from "@/lib/site-config";

// Same links, same order as the shared public header on every other page.
const NAV = buildPublicSiteNavLinks().filter(
  (item): item is PublicNavLink => !isPublicNavDropdown(item),
);

type Props = {
  readonly menuId: string;
  readonly navLabel: string;
};

export function LandingMotionTopbar({ menuId, navLabel }: Props) {
  return (
    <header className="topbar">
      <Link className="logo" href="/" aria-label="AgentRanking">
        <img src={MOTION_ASSETS.mark} alt="" />
      </Link>
      <div className="navmenu" id={menuId}>
        <nav className="navlinks" aria-label={navLabel}>
          {NAV.map((item) => (
            <Link key={item.href} className="pill" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="btn-ghost" href={appLoginUrl()}>
          Sign in
        </Link>
        <a className="btn-white" href={publicSiteRoutes.launchAgentApp}>
          Launch Agent
        </a>
      </div>
      <button
        type="button"
        className="navburger"
        aria-expanded="false"
        aria-controls={menuId}
        aria-label="Open menu"
      >
        <span className="navburger__bars" />
      </button>
    </header>
  );
}
