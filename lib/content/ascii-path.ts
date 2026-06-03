/** Latin-1-safe path segments for Next.js revalidatePath (avoids ByteString errors). */

const ASCII_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isAsciiSlug(slug: string) {
  return ASCII_SLUG.test(slug);
}

export function isAsciiPathSafe(pathname: string) {
  if (!pathname.startsWith("/")) {
    return false;
  }

  for (let i = 0; i < pathname.length; i += 1) {
    if (pathname.charCodeAt(i) > 255) {
      return false;
    }
  }

  return true;
}
