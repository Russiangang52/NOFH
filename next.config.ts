import type { NextConfig } from "next";
import { PHASE_PRODUCTION_SERVER } from "next/constants";
import { execFileSync } from "node:child_process";
import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    localPatterns: [
      { pathname: "/photos/**" },
      { pathname: "/api/media/**" },
    ],
  },
};

export default function configure(phase: string): NextConfig {
  if (phase !== PHASE_PRODUCTION_SERVER) {
    // Build/dev only. No downloads and no runtime writes on Vercel.
    execFileSync(process.execPath, [path.join(process.cwd(), "scripts/restore-photos.mjs")], {
      stdio: "inherit",
    });
  }
  return nextConfig;
}
