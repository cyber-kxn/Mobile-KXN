# NETHEX — Cyber Range

> A production-grade cybersecurity training platform. Data-driven learning
> paths, hands-on rooms, a real browser terminal, and ephemeral, egress-isolated
> Docker labs — wrapped in a sci-fi, PWA-installable web experience.

NETHEX is original work: its branding, content catalogue, lab system, and UI are
not derived from any existing commercial platform.

![stack](https://img.shields.io/badge/React-TS-7C3AED) ![api](https://img.shields.io/badge/Fastify-Node-22D3EE) ![labs](https://img.shields.io/badge/Labs-Docker%20isolated-34D399)

## Highlights

- **Native-feeling web UX** — obsidian dark, violet/cyan glassmorphism, 60fps
  animations, responsive, gesture-friendly, installable PWA.
- **Data-driven catalogue** — Paths → Modules → Rooms → Tasks → Questions across
  foundations, offensive (web, privesc, AD, red team), defensive (SOC, DFIR), and
  modern frontiers (AI/LLM security, cloud).
- **Real browser terminal** — xterm.js over a WebSocket PTY, full ANSI, copy/
  paste, resize, on-screen key bar, helper rail (suggested commands, cheat
  sheets, AI explain), connection status, and lab timer.
- **Isolated cloud labs** — a broker provisions ephemeral Docker sessions
  (attacker + targets) with **dropped egress**, TTL, and per-user quotas.
- **Server-side flags** — only salted hashes live server-side; answers never
  reach the client.
- **AI mentor** — backend Anthropic proxy (rate-limited) with a deterministic
  local fallback so it works offline.
- **Engagement** — XP, levels, streaks, badges, a visual skill-tree roadmap, and
  a leaderboard.
- **Always runnable** — the app runs fully against bundled mock data with zero
  backend; every service degrades gracefully.

## Monorepo layout

```
app/          React + TS + Vite PWA frontend (the product UI)
api/          Fastify (TS) — auth, content, flag validation, AI proxy, WS bridge
lab-broker/   Docker lab provisioning + PTY-over-WebSocket (egress isolation)
content/      Data-driven catalogue (JSON) + server-side answer hashes
infra/        Dockerfiles, docker-compose, nginx, sample lab images
docs/         DEPLOY.md and guides
STATUS.md     Live build status + stubs/fallbacks
DECISIONS.md  Architectural decision log
```

## Quick start

### Just the app (no backend needed)

```bash
cd app
npm install
npm run dev          # http://localhost:5173
```

You'll be dropped into a local demo session: the terminal runs a simulated
shell, labs return simulated metadata, and the mentor uses a local fallback.

### Full stack

```bash
cp .env.example .env
npm run infra:up     # Postgres + Redis + API + lab broker via Docker Compose
# point the app at the API (app/.env.local):
#   VITE_API_URL=http://localhost:8080
#   VITE_WS_URL=ws://localhost:8080
cd app && npm run dev
```

See **[docs/DEPLOY.md](docs/DEPLOY.md)** for production hosting, lab image
builds, and security guidance.

## Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | React 18, TypeScript (strict), Vite, Tailwind, Zustand, TanStack Query, React Router, framer-motion, xterm.js, vite-plugin-pwa |
| API | Fastify, @fastify/jwt, @fastify/websocket, Zod, bcrypt, pg, ioredis |
| Broker | Fastify, dockerode, WebSocket PTY |
| Data | Postgres (durable), Redis (sessions, rate limits, leases) |
| AI | Anthropic Messages API via backend proxy (model configurable) |

## Testing

```bash
cd api && npm test          # flag hashing / validation
cd lab-broker && npm test   # lab isolation + quota invariants
cd app && npm run build     # type-check + production bundle
```

The broker tests assert the security invariant that every lab profile drops
egress and that multi-node labs use the internet-less internal bridge.

## Security model (summary)

Labs are the central trust boundary and run with `NetworkMode=none` (single
host) or an `internal: true` bridge (multi-node), plus `CapDrop: ALL`,
`no-new-privileges`, resource limits, TTL reaping, and `AutoRemove`. Flags are
validated against salted server-side hashes. The AI key never leaves the
backend. Full details in `DECISIONS.md` and `docs/DEPLOY.md`.

## License

Original content and code. Intended for authorized, educational security
training only.
