import type { NextConfig } from "next";
import path from "path";

// Ensure SWC wasm bindings load reliably on Node v26+
if (!process.env.NEXT_TEST_WASM_DIR) {
  process.env.NEXT_TEST_WASM_DIR = path.resolve(
    process.cwd(),
    "node_modules/@next/swc-wasm-nodejs"
  );
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
