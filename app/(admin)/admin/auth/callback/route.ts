import { NextResponse } from "next/server";
import { isAllowedEditorEmail } from "@/lib/auth/editor";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";

function safeAdminNextPath(next: string | null) {
  if (next && next.startsWith("/admin") && !next.startsWith("/admin/auth")) {
    return next;
  }

  return "/admin/essays";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeAdminNextPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      `${origin}/admin/login?error=auth`,
    );
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.redirect(
      `${origin}/admin/login?error=config`,
    );
  }

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.redirect(
      `${origin}/admin/login?error=auth`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAllowedEditorEmail(user?.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(
      `${origin}/admin/login?error=not_allowed`,
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
