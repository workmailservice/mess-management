# Deployment

Target: a single Ubuntu droplet (DigitalOcean or similar) running Postgres, the
app (via PM2), and Nginx as the reverse proxy — everything self-hosted, no
third-party services required.

## 1. Server prerequisites

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib nginx git certbot python3-certbot-nginx

# Node.js 22 (matches this project's dev environment)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

sudo npm install -g pm2

# Firewall: allow SSH + HTTP/HTTPS only
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
sudo ufw enable
```

**If the droplet has 1–2GB RAM** (DigitalOcean's cheapest tiers), add swap before
building — `next build` can otherwise OOM-crash even though it succeeds fine
with swap available (verified: a 961MB droplet with no swap crashed with
`JavaScript heap out of memory`; the same droplet with 2GB swap built fine):

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 2. Database

```bash
sudo -u postgres psql -c "CREATE USER mess_app WITH PASSWORD 'CHANGE-ME';"
sudo -u postgres psql -c "CREATE DATABASE mess_management OWNER mess_app;"
sudo -u postgres psql -c "ALTER USER mess_app CREATEDB;"  # needed once, for prisma migrate's shadow db
```

Use a strong generated password, not the placeholder above.

## 3. Get the code and configure

```bash
cd /var/www
git clone <your-repo-url> mess-management
cd mess-management
npm install
```

Create `.env` (copy `.env.example` and fill in real values):

```bash
cp .env.example .env
```

- `DATABASE_URL` — `postgresql://mess_app:<password>@localhost:5432/mess_management?schema=public`
- `BETTER_AUTH_SECRET` — generate with `openssl rand -base64 32`
- `BETTER_AUTH_URL` — `https://your-domain.com` (must match the real public URL — session cookies are bound to it)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — only used once by the seed script to bootstrap the first login; change the password immediately after first sign-in

## 4. Migrate, seed, build

`npm install` already runs `prisma generate` via its `postinstall` script, so
the client is ready by the time you get here.

```bash
npx prisma migrate deploy
npx prisma db seed
mkdir -p logs
```

`migrate deploy` (not `migrate dev`) applies existing migrations without
prompting or generating new ones — the right command for production.

**This first build still has to happen once on the server**, to produce the
initial `.next/standalone` bundle (see §8 for why later builds don't need to
run here at all):

```bash
NODE_OPTIONS="--max-old-space-size=2048" npm run build
cp -r public .next/standalone/public
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
ln -s ../../.env .next/standalone/.env
```

The `NODE_OPTIONS` flag matters on a low-RAM droplet — `npm run build` can
crash with `JavaScript heap out of memory` even with swap configured, since
Node's default heap-size detection can under-allocate relative to what's
actually available.

## 5. Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # follow the printed instructions to enable PM2 on server reboot
```

Check it's up: `pm2 status`, `pm2 logs mess-management`.

## 6. Nginx + HTTPS

Confirm DNS first — both the apex and `www` A records should already resolve
to the droplet's IP (`dig +short your-domain.com`, `dig +short www.your-domain.com`).

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/mess-management
sudo sed -i 's/your-domain.com/YOUR_REAL_DOMAIN www.YOUR_REAL_DOMAIN/' /etc/nginx/sites-available/mess-management

# Remove the placeholder default site so it can't shadow this one
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/mess-management /etc/nginx/sites-enabled/mess-management
sudo nginx -t && sudo systemctl reload nginx

# Confirm it's actually reachable over plain HTTP before requesting a cert
curl -I http://YOUR_REAL_DOMAIN

# HTTPS certificate — this edits the Nginx config in place to add the cert
# paths and an HTTP->HTTPS redirect, and installs a systemd timer for renewal
sudo certbot --nginx -d YOUR_REAL_DOMAIN -d www.YOUR_REAL_DOMAIN --redirect
```

Certbot will prompt for an email (for renewal/expiry notices) and ToS agreement
interactively; pass `--non-interactive --agree-tos -m you@example.com` to skip
the prompts in a script.

## 7. Automated backups

```bash
crontab -e
```

Add (runs nightly at 2am, keeps 14 days locally by default — see
`scripts/backup-db.sh` for `BACKUP_DIR` / `RETENTION_DAYS` overrides):

```cron
0 2 * * * cd /var/www/mess-management && ./scripts/backup-db.sh >> logs/backup.log 2>&1
```

**Local backups protect against bad migrations, accidental deletes, and
application bugs — they do not protect against losing the droplet itself**
(disk failure, accidental droplet deletion, provider outage). For real
disaster recovery, periodically copy `/var/backups/mess-management` offsite —
e.g. `rclone` to a DigitalOcean Spaces / S3 bucket, or `scp` to a second
machine. This isn't wired up by default since it depends on which offsite
storage you want to use; ask if you'd like this scripted once you've picked one.

Restore from a backup: `./scripts/restore-db.sh /var/backups/mess-management/<file>.dump`
(destructive — prompts for confirmation).

## 8. Deploying an update

The app builds via `output: "standalone"` (see `next.config.ts`), which
produces a minimal, self-contained server bundle at `.next/standalone` —
Next.js traces every file each route actually needs (plus a couple of
Prisma-specific paths this project adds explicitly via
`outputFileTracingIncludes`, since Prisma's WASM client isn't auto-detected)
and copies just those into one folder. That folder is *everything* needed to
run the app: you don't need to run `next build` on the server at all — build
it on your dev machine (more RAM, faster, no risk of OOM-crashing the
droplet) and ship the output.

```bash
git push                       # push your changes first
./scripts/deploy.sh root@168.144.158.223
```

This script (run from your dev machine):
1. Builds locally (`npm run build`)
2. Copies `public/` and `.next/static` into the standalone bundle (Next.js
   requires this manually — they're not traced automatically)
3. SSHes in to `git pull` + `npm install` on the server (fast — no
   compilation, just keeps `node_modules` in sync for the Prisma CLI)
4. `rsync`s the standalone bundle over, deleting stale files from old builds
   but excluding `public/uploads` (admin-uploaded homepage photos, which only
   ever exist on the server) and `.env` (real production secrets)
5. Runs `prisma migrate deploy`, then `pm2 delete mess-management && pm2 start
   ecosystem.config.js && pm2 save`. This causes a brief (~1s) restart rather
   than a zero-downtime reload — `pm2 reload` doesn't pick up a changed
   `script`/`cwd` in the ecosystem file for an already-registered process, it
   just restarts it with whatever config it started with, so a real
   delete+start is required whenever the ecosystem file's script path changes.

Pass a different remote path as a second argument if it's not
`/var/www/mess-management`: `./scripts/deploy.sh root@host /some/other/path`.

**If you ever need to build on the server instead** (e.g. deploying from a
machine without SSH/rsync set up), the old flow still works — `cd
/var/www/mess-management && git pull && npm install && npx prisma migrate
deploy && NODE_OPTIONS="--max-old-space-size=2048" npm run build && cp -r
public .next/standalone/public && cp -r .next/static
.next/standalone/.next/static && pm2 delete mess-management && pm2 start
ecosystem.config.js && pm2 save` — it's just slower and uses more of the
droplet's limited RAM.
