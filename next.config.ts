import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Cieľová pamäť Turbopacku (4 GB): nad ňou uvoľňuje vyrovnávaciu pamäť.
    // Je to cieľ, nie tvrdý limit – tvrdú hranicu stráži scripts/memory-guard.mjs.
    turbopackMemoryLimit: 4 * 1024 * 1024 * 1024,
  },
};

export default nextConfig;
