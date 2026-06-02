# PR11 — CMS Architecture (Final, Pre-Implementation)

**Project:** Criminal Law Archive · jinhocheon.com  
**Phase:** 3 — CMS Foundation (PR11)  
**Status:** **Approval document — no code in this PR**  
**Date:** 2026-06-02  

This document **locks** all CMS decisions for PR11. Implementation must follow this spec unless explicitly revised in a later approval.

**Supersedes:** exploratory notes in `design/CMS-PHASE-3-PROPOSAL.md` where they differ. On conflict, **this document wins**.

---

## 1. Locked decisions summary

| Area | Decision |
|------|----------|
| Authentication | Supabase Magic Link only |
| Accounts | Single admin; email allowlist |
| Password login | **Not used** |
| Database | Supabase Postgres: `essays`, `series` |
| Essay → series link | `essays.series_slug` → `series.slug` |
| Admin scope | Essay CRUD + draft/publish only |
| Editor | Plain `<textarea>` for Markdown `content` |
| Public URLs | Unchanged: `/essays/[slug]`, `/series/[slug]` |
| Draft visibility | **Never** public; `notFound()` always |
| Content source (production) | Supabase after migration cutover |
| Rollback | `CONTENT_SOURCE=mdx` env flag + MDX files retained in repo |

---

## 2. Authentication

### 2.1 Method

- **Supabase Auth — Magic Link (email OTP).**
- Professor enters email on `/admin/login` → receives link → session established via `@supabase/ssr` cookies.

### 2.2 Single admin

- **One editor** for the entire archive (Professor Cheon).
- No registration page, no invite flow, no role management UI in PR11.

### 2.3 Allowlist

- Environment variable: `ALLOWED_EDITOR_EMAIL` (single address, e.g. professor’s email).
- **Login callback** rejects any authenticated user whose email does not match (sign out + error message in Korean).
- Supabase project: **disable public sign-ups** in dashboard; only the allowlisted user may complete magic link.

### 2.4 Explicit exclusions

| Excluded | Reason |
|----------|--------|
| Email + password | Locked out by product decision |
| OAuth (Google, etc.) | Unnecessary complexity |
| Multiple admins | Phase 3 scope; schema does not block a future second allowlist entry |
| API keys for browser writes | Admin writes via Server Actions + server Supabase client only |

### 2.5 Route protection

- **Next.js middleware** on `/admin` and all subpaths except:
  - `/admin/login`
  - `/admin/auth/callback` (or equivalent Supabase callback route)
- Unauthenticated requests → redirect to `/admin/login`.
- Admin layout: **no** public `SiteHeader` / `SiteFooter`; minimal “서재 관리” chrome.

### 2.6 Environment variables (auth)

| Variable | Exposure | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Session client (admin UI) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Repository reads/writes in Server Components / Actions |
| `ALLOWED_EDITOR_EMAIL` | Server | Allowlist check |

---

## 3. Database schema (exact)

### 3.1 Enum type

```sql
CREATE TYPE essay_status AS ENUM ('draft', 'published');
```

### 3.2 Table: `series`

Curated volumes (replaces hard-coded `archiveSeriesTitles` + `lib/series.ts` introductions over time).

```sql
CREATE TABLE series (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text NOT NULL UNIQUE,
  title         text NOT NULL,
  description   text NOT NULL DEFAULT '',
  display_order integer NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX series_display_order_idx ON series (display_order);
```

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Internal PK |
| `slug` | text | **Stable** URL segment for `/series/{slug}`; never change after publish |
| `title` | text | Korean display name (e.g. `형벌과 사회`) |
| `description` | text | Volume intro on series pages (replaces / supplements `seriesIntroductions`) |
| `display_order` | integer | Shelf order on Home / `/series` (was `archiveSeriesTitles` index) |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | Auto-updated on edit |

**Seed (PR11):** 8 rows from current `archiveSeriesTitles` + `getSeriesSlug(title)` + copy from `lib/series.ts` where available.

### 3.3 Table: `essays`

```sql
CREATE TABLE essays (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   text NOT NULL,
  content       text NOT NULL DEFAULT '',
  series_slug   text NOT NULL REFERENCES series (slug) ON UPDATE RESTRICT ON DELETE RESTRICT,
  status        essay_status NOT NULL DEFAULT 'draft',
  featured      boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  published_at  timestamptz,
  -- PR11 parity columns (required for public UI = current MDX)
  essay_date    date NOT NULL,
  category      text NOT NULL DEFAULT ''
);

CREATE INDEX essays_status_essay_date_idx ON essays (status, essay_date DESC);
CREATE INDEX essays_series_slug_idx ON essays (series_slug);
CREATE INDEX essays_updated_at_idx ON essays (updated_at DESC);
```

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Internal PK; used in admin URLs `/admin/essays/[id]` |
| `title` | text | H1, cards, OG |
| `slug` | text | **Public** `/essays/{slug}`; unique; immutable after first `published` |
| `description` | text | Lead paragraph, list cards |
| `content` | text | Markdown body (same as MDX body today) |
| `series_slug` | text | FK → `series.slug` |
| `status` | `draft` \| `published` | Maps to frontmatter `draft: true/false` |
| `featured` | boolean | Same semantics as today |
| `created_at` | timestamptz | Record creation |
| `updated_at` | timestamptz | Last save (draft or published) |
| `published_at` | timestamptz | Set on **first** publish; null while draft |
| `essay_date` | date | **Locked parity field** — display/citation date (`YYYY-MM-DD` from MDX `date`) |
| `category` | text | **Locked parity field** — eyebrow on lists and essay meta |

> **Why `essay_date` and `category`?**  
> Your locked field list did not include them; PR11 **also locks** these two columns because requirement §5 (“published essays behave exactly like current MDX pages”) depends on `essay.date` and `essay.category` across `/essays`, essay detail, and series TOC. Admin form includes both.

### 3.4 Constraints and triggers

```sql
-- published_at must be set when status is published (application-enforced; optional DB check):
-- CHECK (status = 'draft' OR published_at IS NOT NULL)

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER series_updated_at
  BEFORE UPDATE ON series
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER essays_updated_at
  BEFORE UPDATE ON essays
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### 3.5 Row Level Security (RLS)

RLS **enabled** on both tables.

| Role | `series` | `essays` |
|------|----------|----------|
| `anon` | `SELECT` all rows | `SELECT` only `status = 'published'` |
| `authenticated` | `SELECT` all | `SELECT`, `INSERT`, `UPDATE`, `DELETE` all (single editor) |

**Public site reads:** Server Components use **service role** via repository (not browser). RLS still protects accidental anon-key misuse.

**No soft-delete column in PR11:** “삭제” = `DELETE` row (with confirmation). Optional backup via migration export before delete.

### 3.6 Application mapping (`Essay` type)

Repository maps DB → existing app shape:

| DB | App (`lib/essays.ts`) |
|----|------------------------|
| `content` | `content` |
| `essay_date` | `date` (ISO date string) |
| `status = 'draft'` | `draft: true` |
| `status = 'published'` | `draft: false` |
| `series_slug` | resolve `series.title` via join for `essay.series` string |

`getSeriesSlug(essay.series)` behavior unchanged (derived from series **title**, not slug column on essay).

---

## 4. Admin UI

### 4.1 Principles

- **Extremely simple** — list, form, two save actions, no dashboards.
- **Korean** labels, calm typography (reuse archive fonts/tokens where practical).
- **No rich editor** — single large `<textarea>` for `content` (Markdown).
- **No** media library, SEO panel, tags, revisions UI, or analytics.

### 4.2 Routes (locked)

| Path | Purpose |
|------|---------|
| `/admin` | Redirect → `/admin/essays` |
| `/admin/login` | Magic link email entry |
| `/admin/auth/callback` | Supabase session exchange |
| `/admin/essays` | **List** all essays (draft + published) |
| `/admin/essays/new` | **Create** new essay |
| `/admin/essays/[id]` | **Edit** essay (`id` = uuid) |

No other admin routes in PR11 (no `/admin/series` editor — series are seed-only).

### 4.3 Workflow

```
List (/admin/essays)
  → Create (/admin/essays/new)
  → Edit (/admin/essays/[id])
  → Publish (on edit screen)
```

| Step | User action | System |
|------|-------------|--------|
| List | See 제목, 연재, 날짜, 상태 | Sort by `updated_at` desc |
| Create | Fill form → **임시 저장** | Insert `status = draft`, redirect to `[id]` |
| Edit | Change fields → **임시 저장** | Update row, `updated_at` |
| Publish | **공개하기** | `status = published`, set `published_at` if null, revalidate paths |
| Unpublish | **공개 취소** (secondary) | `status = draft`, revalidate (slug unchanged) |
| Delete | **삭제** + confirm | `DELETE` row, revalidate |

### 4.4 Edit form fields

| Label | Field | Control |
|-------|-------|---------|
| 제목 | `title` | text |
| 한 줄 소개 | `description` | textarea (short) |
| 글 날짜 | `essay_date` | date |
| 분류 | `category` | text (suggestions from past values optional) |
| 연재 | `series_slug` | **select** from `series` ordered by `display_order` |
| 대표 글 | `featured` | checkbox |
| 주소 (slug) | `slug` | text; disabled after first publish |
| 본문 | `content` | **textarea** (monospace), Markdown hint |
| | | |
| Actions | | **임시 저장** · **공개하기** · **공개 취소** (if published) · **삭제** |

**Preview:** Optional PR11 stretch — `/admin/essays/[id]` with “미리보기” opening authenticated preview using same `archive-prose` layout. Not required for merge if timeboxed; public parity verified on staging after publish.

### 4.5 List screen columns

- 제목 (link to edit)
- 연재 (`series.title` via `series_slug`)
- 글 날짜 (`essay_date`)
- 상태: `임시` / `공개`
- 링크: 공개 글 → “사이트에서 보기” (`/essays/{slug}`)

Filters: **전체 | 임시 | 공개** (tabs).

---

## 5. Public site behavior

### 5.1 Content access

| `CONTENT_SOURCE` | Behavior |
|----------------|----------|
| `mdx` (dev / rollback) | Read `content/essays/*.mdx` as today |
| `supabase` (production) | Read via repository from Postgres |

Pages **do not** import Supabase directly — only `lib/essays.ts` (backed by repository).

### 5.2 Draft rule (locked, non-negotiable)

For **all** public routes and `generateMetadata`:

```text
IF essay is missing OR status is draft (draft: true)
  → notFound()
```

Applies to:

- `/essays/[slug]` page **and** metadata
- `/essays` list (exclude drafts)
- `/series`, `/series/[slug]`, Home shelf (exclude drafts from counts and links)
- `generateStaticParams` may still know draft slugs for admin builds; **public render must 404**

Fix current MDX gap where draft URLs can render body if slug is known.

### 5.3 Published essay parity

Published Supabase essays must match current MDX pages:

- Same URL: `/essays/{slug}`
- Same layout: `Section`, `EssayMetaRow`, serif `h1`, lead, `archive-prose`, `MDXRemote` on `content`
- Same series navigation: breadcrumb, part label, siblings
- Same citation block using `title`, `essay_date`, `slug`
- Same sorting: essays by `essay_date` desc on index; series ordering by `display_order`

### 5.4 Series pages

- `/series/{slug}` resolves row in `series` by `slug`.
- Essays in volume: `WHERE series_slug = ? AND status = 'published'`.
- `description` column = series page intro (seeded from `lib/series.ts`).
- `getSeriesSlug(title)` remains for any code paths keyed by Korean title.

### 5.5 Revalidation on publish

After publish / unpublish / delete, server revalidates:

- `/`
- `/essays`
- `/essays/[slug]`
- `/series`
- `/series/[series_slug]`

Optional: `POST /api/revalidate` + `REVALIDATION_SECRET` for migration script.

### 5.6 What does not change in PR11

- Home hero, About, Research pages (still static / TS modules)
- Public `SiteHeader` / `SiteFooter` / design tokens
- `featured` flag stored but Home has no featured grid (same as Phase 1)

---

## 6. Migration strategy (complete)

### 6.1 Current state → target state

| | Current | Target |
|---|---------|--------|
| **Essays** | `content/essays/{slug}.mdx` + gray-matter | `essays` table rows |
| **Series metadata** | `archiveSeriesTitles` + `lib/series.ts` | `series` table rows |
| **Registry** | Unused `essayCatalog` in `lib/essays.ts` | **Removed** after cutover |
| **Deploy trigger** | Git push edits MDX | Admin publish + revalidate |
| **Env** | implicit MDX | `CONTENT_SOURCE=supabase` on Vercel production |

### 6.2 Series migration

**Source:**

1. `archiveSeriesTitles` — order → `display_order` (0..7)
2. `getSeriesSlug(title)` — → `slug`
3. `seriesIntroductions[slug]` in `lib/series.ts` — → `description` (fallback: auto-generated Korean sentence if missing)

**SQL seed (conceptual):**

| display_order | title | slug (example) |
|---------------|-------|----------------|
| 0 | 형벌과 사회 | 형벌과-사회 |
| 1 | AI와 형사법 | ai와-형사법 |
| … | … | … |

**After cutover:** `lib/series.ts` introductions become fallback-only until all copy lives in `series.description`. PR11 does not require admin series editor.

### 6.3 Essay migration

**One-time import script** (run against staging, then production):

For each `content/essays/*.mdx` where filename does not start with `_`:

1. **Read file** with `gray-matter`.
2. **Validate** frontmatter: `title`, `description`, `date`, `category`, `series`, `draft`, `featured` (same rules as `parseFrontmatter` today).
3. **Slug** = filename without `.mdx` (must match existing public URLs).
4. **Map fields:**

   | MDX frontmatter | DB column |
   |-----------------|-----------|
   | `title` | `title` |
   | (filename) | `slug` |
   | `description` | `description` |
   | body | `content` |
   | `getSeriesSlug(series)` lookup | `series_slug` — resolve from `series.title` = frontmatter `series` |
   | `draft: true` | `status = 'draft'` |
   | `draft: false` | `status = 'published'` |
   | `featured` | `featured` |
   | `date` | `essay_date` |
   | `category` | `category` |
   | — | `published_at` = `essay_date` at 00:00 UTC **if published**, else `NULL` |

5. **Insert** with `ON CONFLICT (slug) DO UPDATE` for idempotent re-runs on staging.
6. **Report:** missing series match, invalid frontmatter, slug collisions.

**Count expectation:** All non-`_` MDX files in repo (published + draft) become rows.

### 6.4 URL stability

| Resource | Rule |
|----------|------|
| Essay URL | `slug` column **equals** current MDX filename → `/essays/why-people-want-punishment` unchanged |
| Series URL | `series.slug` **equals** current `getSeriesSlug(title)` → `/series/형벌과-사회` unchanged |
| Admin URL | Uses uuid `id` only — never exposed publicly |

**Slug change policy:** Admin may edit `slug` only while `status = draft`. On first publish, `slug` input disabled forever.

### 6.5 Cutover procedure

| Step | Action |
|------|--------|
| 1 | Create Supabase project; run migration SQL; seed `series` |
| 2 | Deploy PR11 with `CONTENT_SOURCE=mdx` (no user-facing change) |
| 3 | Run import on **staging** Supabase; set staging to `CONTENT_SOURCE=supabase` |
| 4 | Verify checklist (§6.7) |
| 5 | Run import on **production** Supabase |
| 6 | Switch production `CONTENT_SOURCE=supabase` |
| 7 | Update `siteConfig.about.editorGuide` to point to `/admin` |
| 8 | Stop editing MDX in repo (files remain as backup) |

### 6.6 Rollback procedure

If Supabase or admin fails after cutover:

1. Set Vercel `CONTENT_SOURCE=mdx` (immediate revert to filesystem).
2. Redeploy or rely on env-only switch if repository factory reads env at runtime.
3. Public site serves last committed MDX in Git (must not delete MDX files in PR11).
4. Fix forward in Supabase; re-import if needed; switch back to `supabase`.

**Data safety:** MDX in repo is the rollback **source of truth** until professor exclusively uses admin for months; optional periodic MDX export script is out of PR11 scope.

### 6.7 Migration verification checklist

- [ ] Every published MDX essay returns 200 at same `/essays/{slug}` under Supabase source
- [ ] Every draft MDX essay returns **404** publicly
- [ ] `/essays` count and order match pre-migration
- [ ] Each `/series/{slug}` lists same published essays
- [ ] Home flagship series (`형벌과-사회`) resolves
- [ ] `display_order` matches former shelf order
- [ ] Citation line date matches `essay_date`
- [ ] One long essay renders `archive-prose` correctly (headings, lists)

---

## 7. Implementation architecture (reference for PR11+)

Not implemented in this document — listed so developers share one picture.

```
app/admin/*          → UI + Server Actions
middleware.ts        → auth guard
lib/essays.ts        → public API (unchanged signatures)
lib/content/
  essay-repository.ts
  mdx-repository.ts
  supabase-repository.ts
supabase/migrations/ → SQL from §3
scripts/import-mdx-to-supabase.ts
```

**Dependencies to add (later PR):** `@supabase/supabase-js`, `@supabase/ssr`.

---

## 8. PR11 scope boundaries

### In scope

- Schema + seed + RLS
- Magic link auth + allowlist
- Admin pages §4.2
- Repository + `CONTENT_SOURCE`
- Draft `notFound()` fix on public essay route
- MDX import script + cutover runbook
- Revalidation on write

### Out of scope

- Series admin CRUD UI
- Password / OAuth auth
- Rich text / WYSIWYG editor
- Image upload (Supabase Storage)
- Research / About CMS
- `essayCatalog` maintenance
- Version history / audit log UI
- Soft delete

---

## 9. Approval checklist

Sign off when all are **Yes**:

- [ ] Magic Link + single email allowlist; no password
- [ ] Schema §3 (`essays` + `series` + parity columns `essay_date`, `category`)
- [ ] Admin routes and workflow §4
- [ ] Public draft = `notFound()` everywhere §5.2
- [ ] Migration + rollback §6
- [ ] `essay_date` + `category` accepted as locked parity fields

---

## 10. Document history

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-06-02 | Final PR11 lock per product requirements |

**Next step after approval:** PR11 implementation — migration SQL file, repository, auth, admin UI, import script, staging cutover.
