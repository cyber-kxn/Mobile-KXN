#!/usr/bin/env bash
# Build the NETHEX lab images the broker provisions. Run from the repo root:
#   bash infra/labs/build.sh
# Needs internet at build time; the resulting containers run egress-isolated.
set -euo pipefail

cd "$(dirname "$0")/../.."

echo "==> Building nethex/lab-linux-base (target)"
docker build -t nethex/lab-linux-base -f infra/labs/Dockerfile.linux-base .

echo "==> Building nethex/lab-attacker (Kali)"
docker build -t nethex/lab-attacker -f infra/labs/Dockerfile.attacker .

# Reuse the official Postgres image for DB-backed labs.
echo "==> Tagging nethex/lab-postgres"
docker pull postgres:16-alpine
docker tag postgres:16-alpine nethex/lab-postgres

cat <<'EOF'

Done. Built:
  - nethex/lab-linux-base   (Linux target for foundations/privesc rooms)
  - nethex/lab-attacker     (real Kali attacker for offensive rooms)
  - nethex/lab-postgres     (DB for web rooms)

Not built here (heavier / Windows): nethex/lab-web-portal, nethex/lab-llm-app,
nethex/lab-windows-dc, nethex/lab-windows-ws. Rooms needing a missing image fall
back to simulated mode automatically.
EOF
