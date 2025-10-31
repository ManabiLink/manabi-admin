import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 開発中のエラー検知を強化
  reactStrictMode: true, // Reactの厳密モードを有効化
  typescript: {
    // 本番ビルド時に型エラーがあれば失敗させる
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
