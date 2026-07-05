# Deployment

Target: a single Ubuntu droplet (DigitalOcean or similar) running Postgres, the
app (via PM2), and Nginx as the reverse proxy — everything self-hosted, no
third-party services required.

## 1. Server prerequisites

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib nginx git

# Node.js 22 (matches this project's dev environment)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

sudo npm install -g pm2

# Firewall: allow SSH + HTTP/HTTPS only
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
sudo ufw enable
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

```bash
npx prisma migrate deploy
npx prisma db seed
npm run build
mkdir -p logs
```

`migrate deploy` (not `migrate dev`) applies existing migrations without
prompting or generating new ones — the right command for production.

## 5. Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # follow the printed instructions to enable PM2 on server reboot
```

Check it's up: `pm2 status`, `pm2 logs mess-management`.

## 6. Nginx + HTTPS

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/mess-management
sudo sed -i 's/your-domain.com/YOUR_REAL_DOMAIN/' /etc/nginx/sites-available/mess-management
sudo ln -s /etc/nginx/sites-available/mess-management /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# HTTPS certificate (auto-renews via a systemd timer Certbot installs)
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d YOUR_REAL_DOMAIN
```

This requires DNS for your domain to already point at the droplet's IP.

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

```bash
cd /var/www/mess-management
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 reload ecosystem.config.js
```

`pm2 reload` (not `restart`) does a zero-downtime reload.
