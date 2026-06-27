import type { NextConfig } from "next";

function getSupabaseImageRemotePatterns() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!supabaseUrl) {
    return [];
  }

  try {
    const { hostname } = new URL(supabaseUrl);
    return [
      {
        protocol: "https" as const,
        hostname,
        pathname: "/storage/v1/object/public/news/**",
      },
      {
        protocol: "https" as const,
        hostname,
        pathname: "/storage/v1/object/public/essays/**",
      },
    ];
  } catch {
    return [];
  }
}

const supabaseImageRemotePatterns = getSupabaseImageRemotePatterns();

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  images:
    supabaseImageRemotePatterns.length > 0
      ? { remotePatterns: supabaseImageRemotePatterns }
      : undefined,
};

export default nextConfig;
