#!/usr/bin/env bash
# Restores the database from a pg_dump file created by backup-db.sh.
# DESTRUCTIVE: drops and recreates every object in the target database.
#
# Usage:
#   ./scripts/restore-db.sh /var/backups/mess-management/mess_management_20260101_020000.dump
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

DUMP_FILE="${1:-}"
if [ -z "$DUMP_FILE" ]; then
  echo "Usage: $0 <path-to-dump-file>" >&2
  exit 1
fi
if [ ! -f "$DUMP_FILE" ]; then
  echo "File not found: $DUMP_FILE" >&2
  exit 1
fi

if [ -z "${DATABASE_URL:-}" ] && [ -f .env ]; then
  export $(grep -E '^DATABASE_URL=' .env | xargs)
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is not set (checked environment and .env)." >&2
  exit 1
fi

# Strip Prisma's `?schema=` query param — pg_restore's libpq URI parser rejects it.
PG_URL="${DATABASE_URL%%\?*}"

echo "WARNING: This will overwrite the current database with the contents of:"
echo "  $DUMP_FILE"
echo "Target: $PG_URL"
read -r -p "Type 'yes' to continue: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Aborted."
  exit 1
fi

pg_restore --clean --if-exists --no-owner --dbname "$PG_URL" "$DUMP_FILE"
echo "Restore complete."
