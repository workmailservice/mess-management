import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal, self-contained server bundle (.next/standalone) via dependency
  // file-tracing, so the heavy build step can run on a dev machine and only the built
  // output needs to ship to the small production droplet — no `npm install`/`next build` there.
  output: "standalone",

  // Prisma's generated client (WASM query compiler) isn't picked up by Next's static
  // dependency tracer — without this, the standalone bundle is missing it and crashes at runtime.
  outputFileTracingIncludes: {
    "/**": ["./src/generated/prisma/**/*"],
  },
};

export default nextConfig;
