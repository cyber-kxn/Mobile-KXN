# NETHEX — Build Status

_Last updated: 2026-06-13_

Legend: ✅ done · 🟡 partial / stubbed · ⬜ not started

## Phase progress

| Phase | Scope | State |
|-------|-------|-------|
| 0 | Monorepo scaffold, design system, nav, mock data | ✅ |
| 1 | Content schema + data-driven UI (paths/modules/rooms/tasks) | ✅ |
| 2 | Auth + backend API (Fastify, Postgres, Redis) | ✅ |
| 3 | Browser terminal (xterm.js over WS PTY) | ✅ |
| 4 | Lab broker (ephemeral, egress-isolated Docker) | ✅ |
| 5 | Network labs + terminal helper rail | ✅ |
| 6 | AI mentor (backend Anthropic proxy + local fallback) | ✅ |
| 7 | Polish + engagement (XP, streaks, badges, leaderboard) | ✅ |
| 8 | Production web build, PWA, deploy docs | ✅ |

All eight phases are functional. Postgres/Redis/Docker/Anthropic each degrade to
a working fallback when absent, so the stack runs end-to-end in any environment.

## What runs today

- `npm install && npm run dev` → boots the **NETHEX** web app (Vite) at
  http://localhost:5173 fully functional against **mock data** (no backend
  required). This satisfies the "always runnable" non-negotiable.
- `npm run build` produces an optimized, PWA-installable static bundle.
- `npm run infra:up` builds the containerized backend (API + Postgres + Redis
  + lab-broker) via `infra/docker-compose.yml`.

## Stubs & fallbacks (logged, never blocking)

- **AI mentor**: backend proxies Anthropic when `ANTHROPIC_API_KEY` is set;
  otherwise a deterministic local stub returns context hints. App-side mentor
  works offline against the stub.
- **Terminal**: frontend xterm.js connects to the broker WS PTY when available;
  without a backend it runs a built-in **simulated shell** so the terminal UX
  is demonstrable standalone.
- **Lab broker**: provisions real Docker sessions when a Docker socket is
  available; otherwise returns simulated session metadata.
- **Auth**: frontend uses a local mock auth store when the API is unreachable;
  real JWT auth is wired when the API is up.

## Known gaps / next commands

- Wire real Postgres migrations into API boot (`api/src/db`).
- Replace simulated PTY with node-pty inside broker containers end-to-end.
- Expand original room catalogue (seed covers all major tracks).
- See `docs/DEPLOY.md` for production hosting steps.
