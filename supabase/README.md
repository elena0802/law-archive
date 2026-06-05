# Supabase (PR11)

Database schema and seeds for the Criminal Law Archive CMS.

**Spec:** [`design/PR11-CMS-ARCHITECTURE.md`](../design/PR11-CMS-ARCHITECTURE.md)

## Apply migrations

### Option A — Supabase Dashboard

1. Open your project → **SQL Editor**.
2. Run each file in `migrations/` in order:
   - `20260602100000_pr11_schema.sql`
   - `20260602100001_pr11_rls.sql`
   - `20260602100002_pr11_seed_series.sql`

### Option B — Supabase CLI

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

## Tables

| Table | Purpose |
|-------|---------|
| `series` | Curated volumes (`display_order`, intro `description`) |
| `essays` | Essay metadata + Markdown `content` |

## Environment

Copy root `.env.example` to `.env.local` and set Supabase keys before admin or `CONTENT_SOURCE=supabase` work.

### Auth (PR11 step 2)

In Supabase Dashboard → **Authentication** → **URL configuration**:

- **Site URL:** your production origin (e.g. `https://jurachun.com`) or `http://localhost:3000` for local dev
- **Redirect URLs:** add  
  `http://localhost:3000/admin/auth/callback`  
  `https://jurachun.com/admin/auth/callback`

Set `ALLOWED_EDITOR_EMAILS` to allowed admin addresses (comma-separated). The legacy
`ALLOWED_EDITOR_EMAIL` variable is still supported when the list is unset. Magic link
login: `/admin/login`.

**Essay import:** see [`IMPORT_GUIDE.md`](../IMPORT_GUIDE.md) — `npm run import:mdx`.
