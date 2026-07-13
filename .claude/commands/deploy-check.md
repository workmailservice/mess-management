---
description: Pre-flight and post-flight status check around a deploy — read-only, never runs scripts/deploy.sh itself
---

Target: $ARGUMENTS (defaults to `root@168.144.158.223` per DEPLOYMENT.md if nothing is given — ask the user to confirm the host if it's not obvious from context)

This is a **read-only status check**, not a deploy trigger. Never run `scripts/deploy.sh`, `pm2 restart/delete/start`, `prisma migrate deploy`, or any other mutating command from this check — those require an explicit, separate request per this project's deploy workflow (see DEPLOYMENT.md §8).

Do the following and report a clear go/no-go summary:

**Local side (this machine):**
1. `git status --short` — flag any uncommitted changes; deploying ships whatever the remote's `git pull` fast-forwards to, so uncommitted local work won't be included.
2. `git log --oneline -1` vs. `git log --oneline origin/main -1` (or the current branch's upstream) — flag if local is ahead of the pushed branch.
3. Confirm `scripts/deploy.sh` and `ecosystem.config.js` haven't changed in a way that's undocumented in DEPLOYMENT.md (quick sanity read, not a full diff review).

**Remote side (read-only SSH):**
4. `ssh <target> "pm2 status"` — is the `mess-management` process online, and what's its uptime/restart count?
5. `ssh <target> "cd /var/www/mess-management && git log --oneline -1"` — what commit is currently deployed, compared to local HEAD?
6. `ssh <target> "sudo nginx -t"` — confirm the Nginx config is currently valid.
7. `ssh <target> "df -h / "` and a quick free-memory check — flag if disk or RAM is tight (this droplet is small; DEPLOYMENT.md notes builds can OOM without swap).

Summarize: is it safe to deploy (clean local tree, pushed, remote healthy), and what commit gap (if any) exists between local and the currently-deployed remote version.
