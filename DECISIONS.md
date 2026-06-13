# NETHEX — Architectural Decision Log

Format: `[date] decision — rationale`.

## Branding
- **2026-06-13** APP_NAME = **NETHEX**; primary accent violet `#7C3AED`,
  secondary cyan `#22D3EE`, obsidian dark base. No references to existing
  commercial platforms; all content, naming, and visual language original.

## Stack
- **2026-06-13** Frontend = **React + TypeScript + Vite** (not Next.js).
  Rationale: the brief requires a PWA-installable, statically-hostable SPA with
  a fast dev loop and a WebSocket terminal; Vite SPA keeps hosting trivial
  (any static host/CDN) and avoids SSR complexity that adds nothing for an
  authed app behind a login. SSR notes captured in `docs/DEPLOY.md`.
- **2026-06-13** Styling = **Tailwind CSS** with a custom design-token layer
  (`app/src/styles/theme.css`) for the sci-fi glassmorphism system.
- **2026-06-13** State = **Zustand** for client/app state, **TanStack Query**
  for server state. Routing = **React Router** (data-driven routes).
- **2026-06-13** Terminal = **xterm.js** + `xterm-addon-fit` over a raw
  WebSocket to a broker PTY. Standalone simulated-shell fallback so the UX is
  demonstrable with no backend.
- **2026-06-13** Backend = **Fastify (TS)** over Nest. Rationale: lighter,
  first-class WS support for the PTY bridge, fast cold start in containers.
- **2026-06-13** Data layer = **Postgres** (durable: users, progress, flags)
  + **Redis** (sessions, rate limits, lab leases).

## Content
- **2026-06-13** Content is **data-driven JSON** under `/content`, validated by
  shared Zod/TS schemas. App ships a bundled snapshot for offline/mock mode;
  API serves the canonical catalogue at runtime. Flags are **never** shipped to
  the client — only salted SHA-256 hashes live server-side for validation.

## Labs / isolation (hard requirements)
- **2026-06-13** Labs run in **ephemeral Docker containers** on a **private
  bridge network with egress dropped** (`--network none` for single-host labs,
  internal bridge for multi-container network labs). TTL + per-user quota
  enforced by the broker via Redis leases. Containers are torn down on
  expiry/disconnect. This isolation is the platform's central security boundary.

## AI
- **2026-06-13** All Anthropic calls go **through the backend proxy only**
  (key never reaches the browser), rate-limited per user via Redis. Guardrails
  restrict the mentor to the current room/lab context. Deterministic local
  stub used when no API key is configured so the feature never hard-fails.

## Always-runnable strategy
- **2026-06-13** Every layer degrades gracefully: the web app is fully usable
  against bundled mock data with zero backend, satisfying "always ship a
  runnable state" at every phase boundary.
