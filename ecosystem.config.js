module.exports = {
  apps: [
    {
      name: "mess-management",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: __dirname,
      // Single instance is plenty for one business's traffic. If this ever needs
      // to use more than one CPU core, switch to exec_mode: "cluster" and raise
      // instances — Next.js request handling is stateless per-request either way.
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "500M",
      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log",
      time: true,
    },
  ],
};
