export function isSafeEditorNextPath(path: string) {
  if (!path.startsWith("/")) {
    return false;
  }

  if (path.startsWith("/admin/auth")) {
    return false;
  }

  return path.startsWith("/admin") || path.startsWith("/preview/");
}

export function safeEditorNextPath(
  next: string | null,
  fallback = "/admin",
) {
  if (next && isSafeEditorNextPath(next)) {
    return next;
  }

  return fallback;
}

export function isEditorProtectedPath(pathname: string) {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return !isAdminAuthPath(pathname);
  }

  return pathname === "/preview" || pathname.startsWith("/preview/");
}

export function isAdminAuthPath(pathname: string) {
  return (
    pathname === "/admin/login" || pathname.startsWith("/admin/auth/")
  );
}
