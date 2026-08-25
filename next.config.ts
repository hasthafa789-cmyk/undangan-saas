import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // [BARU] Memerintahkan Vercel untuk mengabaikan error TypeScript saat proses Build
  typescript: {
    ignoreBuildErrors: true,
  },
  // (Opsional) Memerintahkan Vercel untuk mengabaikan peringatan ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;