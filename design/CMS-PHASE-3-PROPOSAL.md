# Phase 3: CMS Foundation — Design Proposal

**Project:** Criminal Law Archive (jurachun.com)  
**Audience:** Professor Cheon Jin-ho (sole author)  
**Status:** Architecture proposal — **no implementation in this document**  
**Date:** 2026-06-02  

---

## 1. Purpose and success criteria

### 1.1 Goal

Enable the professor to **write, revise, and publish essays** without editing repository files, running Git, or touching the terminal — while keeping the public site’s calm editorial design and stable URLs unchanged.

### 1.2 Success looks like

| Criterion | Measure |
|-----------|---------|
| Independence from code | Create / edit / publish / delete from a browser-only admin |
| Clarity | Korean UI, large type, two clear states: **임시 저장** vs **공개** |
| Safety | Drafts never appear in public lists; unpublished slugs return 404 |
| Continuity | Public routes stay `/essays/[slug]` and `/series/[slug]` |
| Reliability | Publish updates the live site within seconds (on-demand revalidation) |
| Future-proof | Public pages keep using `lib/essays.ts` types and helpers; only the data source changes |

### 1.3 Explicit non-goals (Phase 3)

- Multi-author workflow, comments, newsletter, analytics dashboards  
- CMS for `/research` or `/about` (remain code/config until a later phase)  
- Rich block editor (Notion-style), media CDN, AI writing aids  
- Replacing `archive-prose` typography or public page layouts  
- Version history / rollback UI (keep `updated_at` only; full versioning is Phase 4+)  

---

## 2. Current system (as-is)

### 2.1 Content pipeline today

```
content/essays/{slug}.mdx
        │
        ▼  gray-matter (frontmatter + body)
lib/essays.ts  ──►  app/* pages (Server Components)
        │
        ▼
next-mdx-remote/rsc  →  .archive-prose
```

**Runtime source of truth:** MDX files on disk.  
`essayCatalog` in `lib/essays.ts` duplicates metadata but is **not referenced** elsewhere — it should be removed or replaced during CMS migration to avoid drift.

### 2.2 Essay data model (already stable)

| Field | Type | Public use |
|-------|------|------------|
| `slug` | string (filename) | URL `/essays/{slug}` |
| `title` | string | H1, OG, citation |
| `description` | string | Lead, cards, OG |
| `date` | `YYYY-MM-DD` | Sort, display, citation |
| `category` | string (free text) | Eyebrow / meta |
| `series` | string (display title) | Grouping → `/series/{slug}` |
| `draft` | boolean | Hidden when `true` |
| `featured` | boolean | Reserved (`getFeaturedEssays` exists; home no longer shows a featured grid) |
| `content` | Markdown body | MDXRemote (no custom MDX components in essays today) |

### 2.3 Series model (derived, not stored per essay file)

- **Grouping:** all essays sharing the same `series` string.  
- **Slug:** `getSeriesSlug(series)` — NFKC normalize, Korean-safe, hyphenated.  
- **Order:** `archiveSeriesTitles` in `lib/essays.ts` defines shelf order; unknown series sort after known ones.  
- **Introduction copy:** `lib/series.ts` → `seriesIntroductions` keyed by series slug, with auto-generated fallback.

### 2.4 Public routes (must not break)

| Route | Data functions |
|-------|----------------|
| `/` | `getSeriesBySlug`, `getAllSeries` (flagship + shelf) |
| `/essays` | `getAllEssays()` — published only |
| `/essays/[slug]` | `getEssayBySlug`, series siblings |
| `/series` | `getAllSeries()` |
| `/series/[slug]` | `getSeriesBySlug`, TOC |

`generateStaticParams` on `[slug]` routes prebuilds paths at build time; CMS requires **on-demand revalidation** after publish.

### 2.5 Gaps to fix during CMS work

1. **Draft leakage:** `app/essays/[slug]/page.tsx` calls `notFound()` only when the file is missing; **`draft: true` essays can still render** if the URL is known (metadata hides OG, but body is served). CMS must enforce draft = 404 on the public app regardless of source.  
2. **Dual registry:** remove or automate `essayCatalog` when Supabase is authoritative.  
3. **About copy:** `siteConfig.about.editorGuide` still describes MDX folders — update after CMS ships.  

---

## 3. Recommended architecture

### 3.1 High-level diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vercel (Next.js 16)                       │
├─────────────────────────────────────────────────────────────────┤
│  Public app (unchanged URLs)          │  Admin app               │
│  app/page.tsx, essays, series…        │  app/admin/*             │
│         │                             │         │                │
│         └──────────┬──────────────────┘         │                │
│                    ▼                            ▼                │
│            lib/essays.ts  (facade — same exports & types)        │
│                    ▼                            │                │
│         lib/content/essay-repository.ts         │                │
│              │                    │             │                │
│     MdxRepository          SupabaseRepository ◄─┘ Server Actions │
│     (dev / fallback)              │              + Route Handler │
└───────────────────────────────────┼──────────────────────────────┘
                                    ▼
                          ┌──────────────────┐
                          │     Supabase      │
                          │  Postgres + Auth  │
                          │  Storage (opt.)   │
                          └──────────────────┘
```

**Principle:** Pages and components **never import Supabase directly**. They keep calling `getAllEssays`, `getEssayBySlug`, etc. The repository switch is controlled by environment (`CONTENT_SOURCE=supabase|mdx`).

### 3.2 Why a repository adapter (not “replace lib/essays.ts”)

- Preserves Phase 1 investment in sorting, series aggregation, reading time, citations.  
- Allows **incremental migration**: MDX in dev, Supabase in production.  
- Keeps a single `Essay` / `EssayFrontmatter` type for the whole app.  
- Simplifies testing: mock the repository, not the database.

Proposed layout:

```
lib/
  essays.ts                 # public API (unchanged signatures)
  series.ts                 # introductions (Phase 3b: optional DB column)
  content/
    types.ts                # shared Essay types (move from essays.ts if needed)
    essay-repository.ts     # interface + factory getEssayRepository()
    mdx-repository.ts       # current fs logic
    supabase-repository.ts  # queries
    slug.ts                 # slug rules (shared admin + public)
lib/supabase/
  server.ts                 # service role (server only)
  browser.ts                # anon + session (admin client components)
```

---

## 4. Supabase data model

### 4.1 Tables

#### `series` (curated volumes)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `slug` | text UNIQUE NOT NULL | Stable URL segment; set once at creation |
| `title` | text NOT NULL | Korean display name (e.g. `형벌과 사회`) |
| `introduction` | text | Replaces `seriesIntroductions[slug]` when present |
| `sort_order` | int NOT NULL | Maps from `archiveSeriesTitles` order |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

Seed all eight volumes from `archiveSeriesTitles` + `lib/series.ts` intros.

#### `essays`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | Internal |
| `slug` | text UNIQUE NOT NULL | Public URL; **immutable after first publish** |
| `title` | text NOT NULL | |
| `description` | text NOT NULL | |
| `date` | date NOT NULL | Essay date (not necessarily `published_at`) |
| `category` | text NOT NULL | Free text, as today |
| `series_id` | uuid FK → `series.id` | |
| `body` | text NOT NULL | Markdown (same as current MDX body) |
| `status` | enum `draft` \| `published` | Replaces boolean `draft` in DB |
| `featured` | boolean DEFAULT false | |
| `published_at` | timestamptz NULL | Set on first publish |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |
| `deleted_at` | timestamptz NULL | Soft delete (admin “삭제”; hide from lists) |

**Mapping to app type:**

- `draft` ⇔ `status !== 'published'`  
- `series` (string) ⇔ join `series.title` for display  
- `content` ⇔ `body`  

#### `profiles` (minimal)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | = `auth.users.id` |
| `role` | text | `editor` only for Phase 3 |
| `display_name` | text | Optional |

Single-editor site: only one row with `role = 'editor'` needs to exist.

### 4.2 Indexes

- `essays (status, date DESC)` — public lists  
- `essays (series_id, date)` — series TOC  
- `essays (slug)` — detail lookup  
- `series (sort_order)` — home shelf order  

### 4.3 Row Level Security (RLS)

| Role | `series` | `essays` |
|------|----------|----------|
| `anon` | SELECT all | SELECT where `status = 'published'` AND `deleted_at IS NULL` |
| `authenticated` (editor) | SELECT, INSERT, UPDATE | SELECT all; INSERT/UPDATE own rows; soft-delete via UPDATE |

**Server-side reads for public pages:** use Supabase **service role** in `SupabaseRepository` inside Server Components only (never exposed to the browser). RLS still protects direct client access if the anon key is used in admin previews.

**Admin writes:** Server Actions with service role **or** authenticated user + RLS — prefer session-based RLS for audit trail, service role for migration scripts.

### 4.4 Slug policy

- **Format:** lowercase Latin letters, numbers, hyphens (match existing essays: `why-people-want-punishment`).  
- **Creation:** admin suggests slug from title (romanization / manual entry); professor confirms once.  
- **After publish:** slug field read-only; URL permanence for citations (`formatEssayCitation`).  
- **Collision:** block save if slug exists.  

Korean filenames in `content/essays/` are already discouraged in `content/essays/README.md` — keep that rule in CMS copy.

---

## 5. Authentication

### 5.1 Recommended method: **magic link (email OTP)**

| Reason | Detail |
|--------|--------|
| Age-friendly | No password to remember or rotate |
| Secure | Supabase handles token expiry |
| Simple ops | One email in `ALLOWED_EDITOR_EMAIL` env |

Flow:

1. Professor opens `/admin/login`  
2. Enters email → Supabase sends link  
3. Callback route sets session cookie → redirect to `/admin`  

### 5.2 Access control layers

1. **Supabase:** only whitelisted email(s) can sign up / sign in (hook or check in callback).  
2. **Next.js middleware:** `matcher: ['/admin/:path*']` — require session except `/admin/login`, `/admin/auth/callback`.  
3. **No public registration** — disable open signups in Supabase dashboard.  

### 5.3 Session storage

- `@supabase/ssr` with cookie-based sessions (App Router pattern from Supabase docs).  
- Admin layout does **not** use the public `SiteHeader` / `SiteFooter` — separate minimal chrome (“서재 관리”).

---

## 6. Admin experience (scholar-first UX)

### 6.1 Design tone

Match archive principles: generous whitespace, Noto Sans/Serif KR, no dashboard widgets, no “content marketing” language.

**Avoid:** “Create post”, traffic stats, SEO scores, tag clouds, autosave panic banners.  
**Prefer:** “글 쓰기”, “임시 저장”, “공개하기”, plain Korean confirmations.

### 6.2 Information architecture

```
/admin
  ├── (login)
  ├── /admin                    # 글 목록 (default landing)
  ├── /admin/essays/new         # 새 글
  ├── /admin/essays/[id]        # 편집
  └── /admin/essays/[id]/preview # (optional) authenticated preview
```

No nested settings menus in Phase 3.

### 6.3 Screen: 글 목록 (`/admin`)

| Column | Content |
|--------|---------|
| 제목 | Link to edit |
| 연재 | Series title |
| 날짜 | Essay date |
| 상태 | 뱃지: `임시` / `공개` |
| Actions | 편집 · (공개된 글) 사이트에서 보기 |

- Default sort: `updated_at` desc (recent work first).  
- Filter tabs: **전체 / 임시 / 공개** (three only).  
- Primary action: **+ 새 글** (prominent, not a floating FAB).

### 6.4 Screen: 편집기 (`/admin/essays/[id]`)

**Metadata block (top):**

| Field | Control |
|-------|---------|
| 제목 | text input, large |
| 한 줄 소개 | textarea, 2 rows |
| 날짜 | date picker (`YYYY-MM-DD`) |
| 분류 | text input with **suggestions** from past categories (not a rigid enum) |
| 연재 | **dropdown** from `series` table (required) |
| 대표 글 | single checkbox — `featured` (helper: “나중에 홈이나 추천 영역에 쓰일 수 있습니다”) |
| URL 주소 | slug — editable until first publish |

**Body:**

- Phase 3.0: **large Markdown textarea** + short “마크다운 안내” (제목 `##`, 목록 `-`).  
- Phase 3.1 (optional): lightweight toolbar (bold, heading, list) writing the same Markdown underneath.

Essays today use plain Markdown only — no custom MDX in body — so a textarea is sufficient and predictable.

**Footer actions (always visible):**

| Button | Behavior |
|--------|----------|
| **임시 저장** | `status = draft`; stay on page; toast “저장되었습니다” |
| **공개하기** | validate required fields → `status = published`, set `published_at` → revalidate → toast “공개되었습니다” |
| **삭제** | confirm dialog → soft delete |

**Unpublish:** secondary “공개 취소” → back to draft (keeps slug; removes from public site). Needed for corrections without deleting.

### 6.5 Preview

- **Option A (recommended):** `/admin/essays/[id]/preview` renders the same layout as public essay page inside admin auth.  
- **Option B:** signed preview token on public `/essays/[slug]?preview=…` — more complex; defer unless needed.

### 6.6 Error and validation messages (Korean, plain)

Examples:

- “제목을 입력해 주세요.”  
- “연재를 선택해 주세요.”  
- “이 주소(slug)는 이미 사용 중입니다.”  
- “공개하기 전에 본문을 작성해 주세요.”  

---

## 7. Public site integration

### 7.1 Repository behavior

`SupabaseRepository` implements the same methods as today:

- `getEssayBySlug(slug)`  
- `getAllEssays({ includeDrafts })`  
- `getFeaturedEssays`  
- `getAllSeries` / `getSeriesBySlug` / `getEssaysBySeries`  

Series aggregation moves from in-memory grouping to SQL join + existing sort helpers in `lib/essays.ts`.

### 7.2 Caching and revalidation

| Event | Action |
|-------|--------|
| Publish / unpublish / delete | `revalidatePath('/')`, `/essays`, `/essays/[slug]`, `/series`, `/series/[seriesSlug]` |
| Series intro edit (Phase 3b) | revalidate affected series path |

Implementation:

- Server Action after successful write **or**  
- `POST /api/revalidate` with `REVALIDATION_SECRET` (for scripts / webhooks)

Use **on-demand revalidation**; keep static generation benefits without full redeploy per essay.

`generateStaticParams` can remain (build-time warmup) but is no longer the only way new slugs appear once `dynamicParams = true` or revalidation is wired — **recommend** `export const dynamicParams = true` on essay route when CMS is live.

### 7.3 Draft enforcement (public)

```ts
// Pseudocode — public essay page
const essay = await getEssayBySlug(slug);
if (!essay || essay.draft) notFound();
```

Apply consistently in page component and `generateMetadata`.

### 7.4 MDX rendering

Unchanged: `MDXRemote` with `essay.content` / `body` as Markdown string.  
Optional later: pass `components` for footnotes — not required for launch.

---

## 8. API surface (minimal)

Prefer **Server Actions** in `app/admin/essays/actions.ts` over a large REST API.

| Action | Purpose |
|--------|---------|
| `saveDraft` | create/update draft |
| `publishEssay` | validate + publish + revalidate |
| `unpublishEssay` | draft again + revalidate |
| `deleteEssay` | soft delete + revalidate |
| `signOut` | clear session |

Optional: `POST /api/revalidate` for operational scripts (migration, manual fix).

**No public write API.**

---

## 9. Migration strategy

### 9.1 Phases

| Step | Work |
|------|------|
| **3a — Foundation** | Supabase project, schema, seed series, auth, middleware, repository interface |
| **3b — Admin CRUD** | List / create / edit / delete / publish UI |
| **3c — Wire public site** | `CONTENT_SOURCE=supabase` in production; fix draft gating |
| **3d — Import** | One-time script: read all `content/essays/*.mdx` → `essays` rows |
| **3e — Cleanup** | Remove MDX from deploy path or keep read-only backup; update About editor guide |

### 9.2 Import script requirements

- Parse frontmatter with `gray-matter` (same rules as `parseFrontmatter`).  
- Map `series` string → `series_id` via title lookup.  
- Preserve `slug` from filename.  
- Set `status` from `draft`.  
- Set `published_at` from `date` or file mtime for published essays.  
- Report mismatches (MDX without series match, invalid frontmatter).  

### 9.3 Rollback plan

Keep `MdxRepository` behind `CONTENT_SOURCE=mdx` until import is verified on staging.  
MDX files can remain in repo as **backup** but should not be edited after cutover (single source of truth = Supabase).

---

## 10. Environment and deployment

### 10.1 New environment variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Browser client (admin) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Repository reads/writes |
| `CONTENT_SOURCE` | Server | `supabase` \| `mdx` |
| `ALLOWED_EDITOR_EMAIL` | Server | Auth allowlist |
| `REVALIDATION_SECRET` | Server | On-demand revalidate route |

### 10.2 Vercel + Supabase

- Supabase project in same region as Vercel (e.g. `ap-northeast-1` if available).  
- Add env vars to Vercel Production / Preview.  
- Preview deployments: either read production Supabase (careful) or a **staging** Supabase project.  

### 10.3 Dependencies (implementation phase)

- `@supabase/supabase-js`  
- `@supabase/ssr`  

No ORM required for this scale.

---

## 11. Security checklist

- [ ] Service role key only on server; never `NEXT_PUBLIC_*`  
- [ ] RLS enabled on all tables  
- [ ] Middleware guards `/admin/*`  
- [ ] Email allowlist for login  
- [ ] Slug path traversal blocked (`..`, `/`) — already in `getEssayBySlug`  
- [ ] Soft delete instead of hard delete (recovery window)  
- [ ] Confirm dialog on delete and publish  
- [ ] Rate limiting on auth routes (Supabase defaults + optional Vercel firewall)  

---

## 12. Implementation phases (suggested order)

### Phase 3.0 — Infrastructure (≈1 week)

1. Supabase schema + seed `series`  
2. `lib/content/*` repository + `CONTENT_SOURCE` flag  
3. Supabase Auth + middleware + login page  
4. Fix public draft `notFound()` regardless of source  

### Phase 3.1 — Admin CRUD (≈1–2 weeks)

1. Essay list  
2. Create / edit form + Server Actions  
3. Publish / unpublish / soft delete  
4. Revalidation wired  
5. Admin preview page  

### Phase 3.2 — Go-live (≈3–5 days)

1. Import MDX → Supabase  
2. Staging verification (lists, series order, one long essay)  
3. Production cutover `CONTENT_SOURCE=supabase`  
4. Update `siteConfig.about.editorGuide` and `content/essays/README.md` (pointer to admin)  

### Phase 3.3 — Polish (optional)

1. Category suggestions from history  
2. Simple Markdown toolbar  
3. Move `seriesIntroductions` fully into `series.introduction` editable in admin (series edit screen — **only if professor needs to change copy**; otherwise seed-only is fine)  

---

## 13. Future compatibility

| Concern | How this design handles it |
|---------|---------------------------|
| Existing components | `ArticleCard`, `SeriesVolumeLink`, etc. unchanged — still consume `Essay` / `EssaySeries` |
| `featured` flag | Stored and editable; home can reintroduce a curated block without schema change |
| Phase 2 SEO (JSON-LD, OG images) | Metadata functions keep using repository data |
| Supabase Storage | Optional Phase 4 for inline images; body stays Markdown with `/images/...` paths until then |
| Second editor (assistant) | Add `role`, invite second email — no schema break |
| Research / About CMS | Separate tables later; do not overload `essays` |

---

## 14. Open decisions (need professor / owner input)

| # | Question | Recommendation |
|---|----------|----------------|
| 1 | Magic link vs password? | Magic link |
| 2 | Can slug be edited after publish? | No |
| 3 | Import: keep MDX in git as backup? | Yes, read-only after cutover |
| 4 | Edit series introductions in admin? | Defer; seed from `lib/series.ts` |
| 5 | Staging Supabase project? | Yes, for preview deployments |
| 6 | Image upload in editor? | Defer; use existing `public/images` via deploy or Phase 4 Storage |

---

## 15. Affected files (implementation preview)

**New**

- `design/CMS-PHASE-3-PROPOSAL.md` (this document)  
- `supabase/migrations/*.sql`  
- `lib/content/*`, `lib/supabase/*`  
- `app/admin/**`, `middleware.ts`  
- `app/api/revalidate/route.ts` (optional)  

**Modified**

- `lib/essays.ts` — delegate to repository; remove dead `essayCatalog` or sync from DB  
- `app/essays/[slug]/page.tsx` — draft guard  
- `lib/site.ts` — editor guide copy  
- `package.json` — Supabase deps  
- `.env.example` — new variables  

**Unchanged (by design)**

- Public layout, typography tokens, `archive-prose`, essay/series page structure  
- `components/*` consumption patterns  

---

## 16. Summary

Phase 3 adds a **small, calm admin** on top of **Supabase Postgres + Auth**, hidden behind a **repository adapter** so the public archive keeps its Phase 1 design and URLs. Essays move from MDX files to database rows with the **same fields** the site already understands; series become first-class rows seeded from the current eight volumes. Publishing triggers **on-demand revalidation** so the professor sees changes without a deploy.

The highest-risk gaps in the current codebase — **draft URLs visible** and **duplicate catalog metadata** — are explicitly closed in this plan. Implementation should follow sections **12** and **9** in order, with no change to public visual design.

---

*Next step after approval: implement Phase 3.0 (schema + repository + auth + draft fix), then admin UI.*
