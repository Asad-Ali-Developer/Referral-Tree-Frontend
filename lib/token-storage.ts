const REFRESH_TOKEN_KEY = 'referral_tree_refresh_token';

/**
 * The access token lives only in memory (this module-level variable),
 * never in localStorage — it's short-lived (15m) and this keeps it out
 * of reach of anything that can read localStorage. The refresh token
 * does need to survive a page reload, so it's persisted in
 * localStorage.
 *
 * Tradeoff worth naming: this is still readable by any script running
 * on the page (XSS), which is the inherent limit of doing this without
 * backend changes. A production hardening step would have the backend
 * set the refresh token as an httpOnly cookie instead, so client-side
 * JS never touches it at all — see the backend README for that note.
 */
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function setTokenPair(pair: { accessToken: string; refreshToken: string }) {
  setAccessToken(pair.accessToken);
  setRefreshToken(pair.refreshToken);
}

export function clearTokens() {
  setAccessToken(null);
  setRefreshToken(null);
}
