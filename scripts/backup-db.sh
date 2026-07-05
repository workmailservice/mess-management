#!/usr/bin/env bash
# Backs up the database to a timestamped, compressed pg_dump file and prunes
# backups older than RETENTION_DAYS. Intended to run nightly via cron.
#
# Usage:
#   ./scripts/backup-db.sh
#
# Env overrides:
#   BACKUP_DIR=/var/backups/mess-management   (default)
#   RETENTION_DAYS=14                          (default)
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [ -z "${DATABASE_URL:-}" ] && [ -f .env ]; then
  export $(grep -E '^DATABASE_URL=' .env | xargs)
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is not set (checked environment and .env)." >&2
  exit 1
fi

BACKUP_DIR="${BACKUP_DIR:-/var/backups/mess-management}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
FILENAME="mess_management_${TIMESTAMP}.dump"

# Prisma's connection string carries a `?schema=` query param that pg_dump's
# libpq URI parser doesn't recognize and rejects outright — strip it. This
# also means the dump covers the whole database (all schemas), which is what
# a full backup should do anyway.
PG_URL="${DATABASE_URL%%\?*}"

mkdir -p "$BACKUP_DIR"

echo "Backing up database to $BACKUP_DIR/$FILENAME ..."
pg_dump "$PG_URL" -Fc -f "$BACKUP_DIR/$FILENAME"

echo "Removing backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "mess_management_*.dump" -mtime "+${RETENTION_DAYS}" -delete

SIZE="$(du -h "$BACKUP_DIR/$FILENAME" | cut -f1)"
echo "Backup complete: $BACKUP_DIR/$FILENAME ($SIZE)"
