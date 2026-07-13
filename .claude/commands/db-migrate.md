---
description: Check Prisma migration status and create/apply a new dev migration for schema changes
---

Migration name (optional): $ARGUMENTS

This project uses Prisma migrations (`prisma/migrations/`, schema at `prisma/schema.prisma`). Do the following:

1. Run `npx prisma migrate status` first and report what it says — are there pending migrations, or has `schema.prisma` drifted from the last migration?
2. If `schema.prisma` has uncommitted changes that aren't yet reflected in a migration:
   - If a migration name was given above, run `npx prisma migrate dev --name <that name>`.
   - If no name was given, look at the actual schema diff (`git diff prisma/schema.prisma`) and propose a short, descriptive kebab-case migration name before running `npx prisma migrate dev --name <proposed-name>`.
3. After migrating, run `npx prisma generate` if it wasn't already triggered automatically, so `@prisma/client` types match the new schema.
4. Report the migration file(s) created under `prisma/migrations/` and flag anything that looks like it could be destructive in production (dropping/renaming a column, changing a type, adding a required column without a default) — those need a backfill plan before `prisma migrate deploy` runs against the production database (see DEPLOYMENT.md).

Never run `npx prisma migrate reset` or `npx prisma db push` as part of this command — those are destructive/bypass-migration operations and must be explicit, separate requests.
