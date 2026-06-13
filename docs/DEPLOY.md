# NETHEX — Deployment Guide

This guide covers running NETHEX locally, with the full containerized backend,
and in production (static web host + API/broker on a VPS).

## 1. Prerequisites

- Node 20 or 22, npm
- Docker + Docker Compose (for backend + labs)
- (Optional) An `ANTHROPIC_API_KEY` for the live AI mentor

Copy the env template and edit as needed:

```bash
cp .env.example .env
```

Every secret has a safe fallback — the stack boots in a degraded "mock" mode
when secrets/services are absent, so you can start without any configuration.

## 2. Frontend only (zero backend)

The web app is fully usable against bundled mock data:

```bash
cd app && npm install && npm run dev      # http://localhost:5173
npm run build && npm run preview          # production bundle, PWA installable
```

In this mode: auth uses a local demo session, the terminal runs its built-in
simulated shell, labs return simulated metadata, and the AI mentor uses the
deterministic local fallback.

## 3. Full stack with Docker Compose

Builds and runs Postgres, Redis, the API, and the lab broker:

```bash
npm run infra:up      # docker compose -f infra/docker-compose.yml up -d --build
docker compose -f infra/docker-compose.yml logs -f api
npm run infra:down
```

Then point the app at the API:

```bash
# app/.env.local
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080
```

Verify health: `curl localhost:8080/health` and `curl localhost:8090/health`.

### Building lab images

The broker provisions ephemeral target containers from `nethex/lab-*` images.
Build the sample target:

```bash
docker build -t nethex/lab-linux-base -f infra/labs/Dockerfile.linux-base .
```

Until an image exists, the affected lab transparently falls back to simulated
mode (logged by the broker).

### Get a REAL Kali terminal on your desktop (simple steps)

On a desktop/laptop with **Docker Desktop** running:

```bash
# 1. Clone and enter the repo
git clone https://github.com/cyber-kxn/Mobile-KXN.git
cd Mobile-KXN

# 2. Start the backend (API + Postgres + Redis + lab broker)
cp .env.example .env
npm run infra:up

# 3. Build the lab images, including the real Kali attacker box
bash infra/labs/build.sh        # first run pulls Kali — a few minutes

# 4. Start the web app pointed at your local backend
cd app
npm install
printf "VITE_API_URL=http://localhost:8080\nVITE_WS_URL=ws://localhost:8080\n" > .env.local
npm run dev                     # open http://localhost:5173
```

Now open an **offensive room** (e.g. *Injection Clinic* or *Forest Foothold*),
hit **Deploy lab**, and the terminal drops you into a genuine **Kali** container
(`nethex/lab-attacker`) — egress-isolated, auto-expiring. Single-host rooms give
you the Linux target instead. That's it: your PC hosts everything locally.

## 4. Production topology

```
            ┌──────────────┐      HTTPS       ┌────────────────────┐
 Browser ──▶│  Static host │ ◀── PWA assets ──│  CDN / Vercel /     │
   │        │  (web/dist)  │                  │  Netlify / S3+CF    │
   │        └──────────────┘                  └────────────────────┘
   │  XHR + WS (wss)
   ▼
 ┌─────────────────────────── VPS / cloud host ───────────────────────────┐
 │  reverse proxy (TLS) ─▶ api:8080  ─▶ postgres / redis                   │
 │                         lab-broker:8090 ─▶ Docker engine (lab sandbox)  │
 └────────────────────────────────────────────────────────────────────────┘
```

### Web (static)

```bash
docker build -t nethex/web -f infra/Dockerfile.web \
  --build-arg VITE_API_URL=https://api.example.com \
  --build-arg VITE_WS_URL=wss://api.example.com .
```

Or host `app/dist` on any static host/CDN. Because routing is client-side, add
an SPA history fallback to `index.html` (the bundled `infra/nginx.conf` does
this). The PWA service worker enables installability and offline shell.

> **OTA updates:** the service worker uses `registerType: autoUpdate`, so new
> deploys are picked up automatically on next load — the backend serves the
> canonical content catalogue at `/content/catalog`, so content updates ship
> without an app rebuild.

### API + broker

Run behind a TLS-terminating reverse proxy (Caddy/Nginx/Traefik). Set strong
`JWT_SECRET` and `FLAG_SALT`, real `DATABASE_URL`/`REDIS_URL`, and lock
`CORS_ORIGINS` to your web origin.

## 5. Security notes (read before exposing labs)

- **Lab isolation is the core boundary.** Single-host labs run with
  `NetworkMode=none` (no NIC, zero egress); multi-node labs share an
  `internal: true` bridge (no internet route). Containers also run with
  `CapDrop: ALL`, `no-new-privileges`, and memory/PID/CPU limits, and are
  `AutoRemove` + TTL-reaped.
- **The broker holds the Docker socket.** Treat it as privileged: run it on a
  dedicated host or rootless/remote Docker, never expose its port publicly, and
  only let the API reach it on a private network.
- **Flags never reach the client.** Only salted SHA-256 hashes are stored
  server-side; validation happens in the API.
- **AI key stays server-side.** The browser only talks to the API's rate-limited
  `/ai/mentor` proxy.

## 6. Operations

| Action | Command |
|--------|---------|
| Tail API logs | `docker compose -f infra/docker-compose.yml logs -f api` |
| Reap orphan labs | `docker rm -f $(docker ps -aq --filter label=nethex.ephemeral=true)` |
| DB shell | `docker compose -f infra/docker-compose.yml exec postgres psql -U nethex` |
| Rebuild one service | `docker compose -f infra/docker-compose.yml up -d --build api` |
