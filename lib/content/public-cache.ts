/**
 * ISR window for public CMS-backed pages (seconds).
 * Route segments must use the literal `export const revalidate = 60` — Next.js
 * does not accept imported values for segment config.
 */
export const PUBLIC_PAGE_REVALIDATE_SECONDS = 60;
