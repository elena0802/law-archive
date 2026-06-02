# MDX → Supabase Import Guide

This guide explains how to copy essays from `content/essays/*.mdx` into the Supabase `essays` table for PR11 CMS cutover.

**MDX files are not deleted.** They remain the rollback source when `CONTENT_SOURCE=mdx`.

---

## Prerequisites

1. Supabase project with PR11 migrations applied (`series`, `essays`, RLS).
2. Series seed migration run (`pr11_seed_series.sql`) so `series_slug` foreign keys resolve.
3. `.env.local` at the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The import script uses the **service role** key (server-only).

---

## Run the import

From the project root:

```bash
npm run import:mdx
```

On Node.js 20, the script loads the `ws` package automatically (Supabase client requirement). Node.js 22+ does not need this.

The script:

- Reads every `content/essays/*.mdx` file (skips `_template.mdx` and `_*.mdx`).
- Maps frontmatter to database columns.
- **Upserts** by `slug` (safe to run multiple times).

### Status mapping

| MDX frontmatter | Database |
|-----------------|----------|
| `draft: true` | `status = draft` |
| `draft: false` | `status = published` |

`published_at` is set on first import of a published essay (from `date`). Existing `published_at` values are preserved on re-import.

### Series mapping

MDX `series:` (Korean title, e.g. `형벌과 사회`) is matched to `essays.series_slug` via the `series.title` column. If no row matches, that file is **skipped** and listed in the report.

---

## Verification report

After each run you will see:

```
  Imported: N   ← new slugs
  Updated:  M   ← existing slugs with changed data
  Skipped:  K   ← parse errors, unknown series, unchanged rows, or DB errors
```

### Verify in Supabase

1. Open **Table Editor → essays**.
2. Confirm row count matches published + draft MDX files (minus skipped).
3. Check a few slugs: `why-people-want-punishment`, `ai-era-lawyer-role`.
4. Confirm `status` and `series_slug` look correct.

### Verify in admin

1. `npm run dev`
2. Log in at `/admin/login`
3. Open `/admin/essays` — titles and statuses should match MDX.

### Verify on the public site

1. In `.env.local` set:

```env
CONTENT_SOURCE=supabase
```

2. Restart the dev server.
3. Visit:
   - `/essays` — only **published** essays
   - `/essays/why-people-want-punishment` — published example
   - A draft slug (if any) — should **404**
   - `/series/형벌과-사회` — published essays in that volume

4. Compare with `CONTENT_SOURCE=mdx` to confirm parity before production cutover.

---

## Switch `CONTENT_SOURCE`

| Value | Public site reads from |
|-------|-------------------------|
| `mdx` (default) | `content/essays/*.mdx` |
| `supabase` | Postgres `essays` + `series` |

Change `.env.local`, restart `npm run dev` or redeploy on Vercel.

Production cutover checklist:

1. Run `npm run import:mdx` against production Supabase (or staging first).
2. Verify admin + public URLs on staging with `CONTENT_SOURCE=supabase`.
3. Set `CONTENT_SOURCE=supabase` on Vercel Production.
4. Redeploy.

After admin edits, paths revalidate automatically (`revalidatePublicEssayPaths`).

---

## Rollback procedure

If you need to revert the public site to filesystem content:

1. Set `CONTENT_SOURCE=mdx` in `.env.local` or Vercel.
2. Redeploy or restart the dev server.

No database changes are required. MDX files in the repo remain authoritative for rollback until you rely on Supabase-only editing.

To re-sync Supabase from MDX after rollback:

```bash
npm run import:mdx
```

Unchanged rows are skipped; changed MDX files are updated.

---

## Troubleshooting

| Problem | Action |
|---------|--------|
| `Supabase is not configured` | Add URL + `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` |
| `unknown series` in skipped list | Ensure `series` table is seeded; `series` title must match MDX `series:` exactly |
| Public site empty with `supabase` | Run import; confirm essays have `status = published` |
| Draft visible on public URL | Should not happen — report a bug; drafts must `notFound()` |
| Duplicate slugs | Import uses `onConflict: slug` — duplicates should not occur |

---

## Related docs

- `design/PR11-CMS-ARCHITECTURE.md` — approved CMS design
- `supabase/README.md` — migrations and auth URLs
- `content/essays/README.md` — MDX authoring (legacy / rollback)
