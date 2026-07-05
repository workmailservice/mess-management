module.exports = {
  apps: [
    {
      name: "mess-management",
      // Runs the pre-built standalone bundle produced by `output: "standalone"`
      // (see next.config.ts) — the build happens on a dev machine via
      // scripts/deploy.sh, not on this server, so cwd points inside the bundle
      // scripts/deploy.sh ships rather than the repo root.
      script: "server.js",
      cwd: __dirname + "/.next/standalone",
      // Single instance is plenty for one business's traffic. If this ever needs
      // to use more than one CPU core, switch to exec_mode: "cluster" and raise
      // instances — Next.js request handling is stateless per-request either way.
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "127.0.0.1",
      },
      max_memory_restart: "500M",
      error_file: __dirname + "/logs/pm2-error.log",
      out_file: __dirname + "/logs/pm2-out.log",
      time: true,
    },
  ],
};
