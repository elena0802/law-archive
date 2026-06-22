import type { NextConfig } from "next";

function getSupabaseImageRemotePattern() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!supabaseUrl) {
    return null;
  }

  try {
    const { hostname } = new URL(supabaseUrl);
    return {
      protocol: "https" as const,
      hostname,
      pathname: "/storage/v1/object/public/news/**",
    };
  } catch {
    return null;
  }
}

const supabaseImageRemotePattern = getSupabaseImageRemotePattern();

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  images: supabaseImageRemotePattern
    ? { remotePatterns: [supabaseImageRemotePattern] }
    : undefined,
};

export default nextConfig;
