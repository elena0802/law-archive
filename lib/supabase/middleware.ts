import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import {
  isAllowedEditorEmail,
  isEditorAllowlistConfigured,
} from "@/lib/auth/editor";
import {
  isEditorProtectedPath,
  safeEditorNextPath,
} from "@/lib/auth/editor-paths";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database";

const ADMIN_LOGIN = "/admin/login";

function redirectToLogin(request: NextRequest, nextPath?: string) {
  const url = request.nextUrl.clone();
  url.pathname = ADMIN_LOGIN;
  url.search = "";

  if (nextPath && nextPath !== ADMIN_LOGIN) {
    url.searchParams.set("next", nextPath);
  }

  return NextResponse.redirect(url);
}

/**
 * Refreshes Supabase session cookies and guards editor-only routes (/admin/*, /preview/*).
 */
export async function updateSupabaseSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = isEditorProtectedPath(pathname);

  if (!isSupabaseConfigured() || !isEditorAllowlistConfigured()) {
    if (isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = ADMIN_LOGIN;
      url.searchParams.set("error", "config");
      return NextResponse.redirect(url);
    }

    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && !isAllowedEditorEmail(user.email)) {
    await supabase.auth.signOut();
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN;
    url.searchParams.set("error", "not_allowed");
    return NextResponse.redirect(url);
  }

  if (isProtected) {
    if (!user) {
      return redirectToLogin(request, pathname);
    }

    if (!isAllowedEditorEmail(user.email)) {
      const url = request.nextUrl.clone();
      url.pathname = ADMIN_LOGIN;
      url.searchParams.set("error", "not_allowed");
      return NextResponse.redirect(url);
    }
  }

  if (pathname === ADMIN_LOGIN && user && isAllowedEditorEmail(user.email)) {
    const next = safeEditorNextPath(
      request.nextUrl.searchParams.get("next"),
    );
    const url = request.nextUrl.clone();
    url.pathname = next;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
