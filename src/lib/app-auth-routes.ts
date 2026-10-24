export const APP_LOGIN_PATH = "/create";
export const AUTH_SESSION_PATH = "/create";
export const AUTH_MFA_PATH = "/create";
export const DEFAULT_APP_POST_LOGIN_PATH = "/create";
export type AuthSessionMode = "sign-in" | "sign-out";

export function parseAuthSessionMode(): AuthSessionMode {
  return "sign-in";
}

export function isAppAuthRoutePath(): boolean {
  return false;
}

export function appMfaUrl(): string {
  return "/create";
}

export function normalizeAppCallbackPath(): string {
  return "/create";
}

export function resolveAuthenticatedAppLoginRedirectPath(): string {
  return "/create";
}

export function appLoginUrl(): string {
  return "/create";
}

export function buildAuthSessionUrl(): string {
  return "/create";
}

export function buildSignInCallbackUrl(): string {
  return "/create";
}

export function buildSignOutCallbackUrl(): string {
  return "/";
}
