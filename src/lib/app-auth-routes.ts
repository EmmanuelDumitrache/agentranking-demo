export const APP_LOGIN_PATH = "/auth/login";
export const AUTH_SESSION_PATH = "/auth/login";
export const AUTH_MFA_PATH = "/auth/login";
export const DEFAULT_APP_POST_LOGIN_PATH = "/dashboard";
export type AuthSessionMode = "sign-in" | "sign-out";

export function parseAuthSessionMode(): AuthSessionMode {
  return "sign-in";
}

export function isAppAuthRoutePath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === APP_LOGIN_PATH || pathname.startsWith("/auth/");
}

export function appMfaUrl(): string {
  return "/auth/login";
}

export function normalizeAppCallbackPath(raw?: string | null): string {
  if (!raw || typeof raw !== "string") return DEFAULT_APP_POST_LOGIN_PATH;
  const trimmed = raw.trim();
  if (trimmed.startsWith("/dashboard") || trimmed.startsWith("/create") || trimmed.startsWith("/launch")) {
    return trimmed;
  }
  return DEFAULT_APP_POST_LOGIN_PATH;
}

export function resolveAuthenticatedAppLoginRedirectPath(raw?: string | null): string {
  return normalizeAppCallbackPath(raw);
}

export function appLoginUrl(callbackPath?: string | null): string {
  if (callbackPath && callbackPath !== DEFAULT_APP_POST_LOGIN_PATH) {
    return `${APP_LOGIN_PATH}?callbackUrl=${encodeURIComponent(callbackPath)}`;
  }
  return APP_LOGIN_PATH;
}

export function buildAuthSessionUrl(): string {
  return APP_LOGIN_PATH;
}

export function buildSignInCallbackUrl(callbackPath?: string | null): string {
  return normalizeAppCallbackPath(callbackPath);
}

export function buildSignOutCallbackUrl(fallback = "/"): string {
  return fallback || "/";
}
