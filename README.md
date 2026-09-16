# Referral Network — Frontend

Next.js (App Router) + TypeScript + Tailwind + shadcn-style components, talking to the
[referral-tree-backend](../referral-tree-backend) API.

## Setup

```bash
npm install
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm run dev
```

Requires the backend running (see its own README) with a `GET /users/me` endpoint —
add that to your backend if you're on an earlier copy of it.

## How the pieces fit together

```
app/
  login/page.tsx        sign in
  onboarding/page.tsx    create a school + its first (root) user, then auto-login
  dashboard/
    layout.tsx           wraps children in AuthGuard + AppHeader
    page.tsx             stats, referral code, invite dialog, tree
components/
  ui/                    hand-written shadcn-style primitives (button, card, dialog, ...)
  layout/                AuthGuard (silent-refresh-on-load), AppHeader (user menu)
  dashboard/             stat strip, referral tree (recursive), invite dialog
lib/
  api-client.ts          axios instance + the 401 → refresh → retry interceptor
  token-storage.ts        access token in memory, refresh token in localStorage
services/                one thin module per backend resource (auth/users/schools/referrals)
store/                   Redux Toolkit — a single `auth` slice (user + session status)
```

## Auth flow

- **Access token**: kept only in a module-level JS variable (never localStorage) — it's
  short-lived (15m per the backend) and this keeps it out of reach of anything reading
  localStorage.
- **Refresh token**: persisted in localStorage so a page reload doesn't force a re-login.
- **On every page load**, `AuthGuard` exchanges the stored refresh token for a fresh
  access token, then calls `GET /users/me` to hydrate the Redux `auth` slice. No refresh
  token, or a rejected one, sends the visitor to `/login`.
- **On any 401** from a real API call, the axios response interceptor in `api-client.ts`
  transparently refreshes once and retries the original request — concurrent requests
  that 401 at the same time share a single in-flight refresh instead of each triggering
  their own.

**Known tradeoff, worth being upfront about**: the refresh token sits in localStorage,
which is readable by any script running on the page (XSS risk) — the same limitation
noted in the backend's own README. The hardened version of this has the backend set the
refresh token as an `httpOnly` cookie instead, so client-side JS never touches it; that
requires a small backend change (returning `Set-Cookie` instead of a JSON field) and was
left out here to keep the API contract between frontend and backend unchanged.

## Design decisions

- **No dark mode / no CSS-variable theming** — the brief asked for minimalist and clean,
  not configurable; colors are plain Tailwind tokens in `tailwind.config.ts` for clarity
  rather than the usual shadcn CSS-variable indirection, which isn't earning its keep
  without a theme switch to justify it.
- **Palette and type are deliberately not the default AI-dashboard look** — see the
  design plan in the conversation this was built from: a stone/moss "school registry"
  palette instead of cream+terracotta or near-black+neon, flat hairline-bordered cards
  instead of soft-shadow SaaS cards, IBM Plex Sans for UI text with Source Serif 4
  reserved for page titles and stat numbers only.
- **The referral tree is the one bold element** — rendered with real nested connecting
  lines (`components/dashboard/tree-node.tsx`), since that's the actual payoff of the
  product; everything else on the page stays quiet by comparison.
- **Plain controlled forms, no react-hook-form/zod** — kept deliberately simple given the
  form surface is small (3–4 fields, three forms total); the natural next step if the
  form surface grows is introducing a schema-validation library rather than hand-rolling
  more validation logic.
- **No Next.js middleware for route protection** — tokens live in localStorage/memory,
  which Next's edge middleware can't read, so protection is done client-side via
  `AuthGuard` instead. A cookie-based auth upgrade (see the tradeoff above) would also
  enable proper middleware-based protection as a side benefit.
