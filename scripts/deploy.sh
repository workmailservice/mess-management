#!/usr/bin/env bash
set -euo pipefail

# Builds the app on this (dev) machine and ships only the pre-built standalone
# bundle to the production server, so the slow, memory-hungry `next build`
# step never has to run on the small droplet. Everything else (package.json,
# prisma/, ecosystem.config.js, scripts, nginx conf) stays source-controlled —
# the server picks those up via `git pull`, same as before.
#
# Precondition: commit and `git push` your changes first — this deploys
# whatever the server's `git pull` fast-forwards to, so the local build must
# match the same commit.
#
# Usage: ./scripts/deploy.sh user@host [remote-path]

REMOTE="${1:?Usage: ./scripts/deploy.sh user@host [remote-path]}"
REMOTE_PATH="${2:-/var/www/mess-management}"

cd "$(dirname "$0")/.."

echo "==> Building locally"
NODE_OPTIONS="--max-old-space-size=2048" npm run build

echo "==> Assembling standalone bundle"
rm -rf .next/standalone/public .next/standalone/.next/static
cp -r public .next/standalone/public
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static

echo "==> Pulling matching source on $REMOTE and installing deps (for the Prisma CLI — no build runs here)"
ssh "$REMOTE" "cd $REMOTE_PATH && git pull && npm install"

echo "==> Syncing build output to $REMOTE:$REMOTE_PATH"
# --delete cleans out stale files from previous builds, but --exclude protects
# two things that only ever exist on the server, never in this local build:
# public/uploads (admin-uploaded photos) and .env (real production secrets —
# excluded here as a hard safety net even though this build shouldn't contain one).
rsync -az --delete --exclude 'public/uploads' --exclude '.env' \
  .next/standalone/ "$REMOTE:$REMOTE_PATH/.next/standalone/"

echo "==> Migrating and restarting"
# `pm2 reload` does NOT pick up a changed script/cwd/args in the ecosystem file
# for an already-registered process — it just restarts it with the OLD config.
# delete + start is what actually applies ecosystem.config.js's current contents.
ssh "$REMOTE" "cd $REMOTE_PATH && \
  [ -e .next/standalone/.env ] || ln -s ../../.env .next/standalone/.env && \
  npx prisma migrate deploy && mkdir -p logs && \
  (pm2 delete mess-management 2>/dev/null || true) && \
  pm2 start ecosystem.config.js && pm2 save"

echo "==> Done. Check status with: ssh $REMOTE 'pm2 status'"
