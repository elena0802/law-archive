# Phase 1 — Implementation Plan

**Status:** Ready to implement  
**Prerequisite:** Approved design proposal (`design/DESIGN-PROPOSAL.md`)  
**Content:** Existing MDX + `lib/essays.ts` — no schema changes required for Phase 1  
**CMS:** Not in this phase

---

## Goals

1. Ship approved **archive IA** and **Korean navigation** in the Next.js app.  
2. Implement **scholarly-warmth home hero** (study illustration + approved headline + flagship series).  
3. Upgrade essay, series, and about pages to editorial/archive patterns from comps.  
4. Preserve all current publishing workflow (`content/essays/*.mdx`, draft, git deploy).

---

## Configuration (site-level)

Add a small config module for values used on home only:

**File:** `lib/site.ts` (new)

```ts
export const siteConfig = {
  name: "형사법 아카이브",
  tagline: "형사법의 글과 강의 노트를 조용히 모으는 디지털 서재",
  flagshipSeriesSlug: "형벌과-사회", // getSeriesSlug("형벌과 사회")
  heroImage: "/images/hero-study.svg",
  heroImageAlt:
    "책과 손글씨 메모가 놓인 서재 책상, 조용한 연구 공간을 담은 선화",
} as const;
```

**Headline (hard-coded or in config):**

```
형사법을 연구하며
사람과 사회를 생각해 왔습니다.
```

**Lead (suggested default — editable in one place):**

> 오랜 세월 강의실과 서재 사이를 오가며 남긴 질문들입니다. 책상 위 메모와 판례 속의 문장처럼, 이곳에는 형사법을 가르치고 글쓰던 한 학자의 생각이 차분히 놓입니다.

---

## Task breakdown

### 1. Global chrome

| File | Changes |
|------|---------|
| `components/site-header.tsx` | Nav: 서재, 글, 연재, 서재 소개 · wordmark `형사법 아카이브` · active link style |
| `components/site-footer.tsx` | Korean tagline from `siteConfig` |
| `app/layout.tsx` | Update `metadata.title.default` / descriptions if needed (Korean-first) |

**New (optional):** `components/nav-link.tsx` — active segment via `usePathname` (client wrapper only for nav, or manual `aria-current` per layout).

---

### 2. Home hero (priority)

| File | Changes |
|------|---------|
| `public/images/hero-study.svg` | Copy from `design/comps/hero-study-illustration.svg` |
| `components/home-hero.tsx` (new) | Two-column hero: `Image` + charter + `HomeSeriesPanel` |
| `components/home-series-panel.tsx` (new) | 「지금 읽는 연재」— title, intro, meta, link, compact TOC from `getSeriesBySlug` |
| `app/page.tsx` | Replace current sections with `HomeHero` + 연재 서가 (drop recent/featured card grids per proposal) |

**Hero structure:**

```
<HomeHero>
  <figure> illustration + figcaption </figure>
  <div>
    eyebrow: 디지털 서재
    h1: approved headline (two lines)
    p.lead: warm charter
    <HomeSeriesPanel series={flagship} />
  </div>
</HomeHero>
<Section> 연재 서가 — volume links </Section>
```

**Tailwind:** extend layout utilities if needed (`lg:grid-cols-[0.95fr_1.05fr]`, `bg-paper-muted`, illustration frame `border border-line bg-paper`).

**Do not:** full-bleed photo hero · gradient blobs · “Subscribe” / “Read more” buttons · English section titles on home.

---

### 3. 연재 서가 (home below hero)

| File | Changes |
|------|---------|
| `components/series-volume-link.tsx` (new) | Volume row: meta, serif title, one-line blurb |
| `app/page.tsx` | `getAllSeries()` — exclude flagship or show all; link to `/series` |

Use **series description** from `getSeriesDescription` until `series_intro` exists (Phase 1.5 optional).

---

### 4. Essays index

| File | Changes |
|------|---------|
| `components/catalogue-entry.tsx` (new) | Date column + title + series/category (replace `ArticleCard` on index) |
| `app/essays/page.tsx` | Title 「글」 or 「전체 글」 · registry list |

---

### 5. Essay detail

| File | Changes |
|------|---------|
| `components/essay-meta.tsx` (new) | Breadcrumb, meta row, optional part N/M |
| `components/citation-block.tsx` (new) | Korean citation string + copy button (minimal client) |
| `components/series-siblings.tsx` (new) | Same-series links from `getEssaysBySeries` |
| `app/essays/[slug]/page.tsx` | Wire components · deck above `.archive-prose` |

**Part N/M:** compute from sorted essays in series by date (or add `series_order` frontmatter later).

---

### 6. Series index & detail

| File | Changes |
|------|---------|
| `components/series-toc.tsx` (new) | Numbered catalogue rows |
| `app/series/page.tsx` | Korean copy · volume presentation |
| `app/series/[slug]/page.tsx` | Intro paragraph + `SeriesToc` · remove `ArticleCard` stack |

**Phase 1.5 (optional):** `content/series/*.md` for `introduction` — else use expanded static blurb in `lib/site.ts` per slug.

---

### 7. About page

| File | Changes |
|------|---------|
| `content/about.md` or inline in page | Biography, research, publications, timeline (MDX or structured TS until CMS) |
| `components/about-section.tsx` (new) | Consistent section headings |
| `app/about/page.tsx` | Four approved sections + collapsed 서재 안내 (`<details>`) |

Use placeholder content from comps until final copy from professor.

---

### 8. Shared styles

| File | Changes |
|------|---------|
| `app/globals.css` | Optional: `.hero-charter`, `.catalogue-row`, `.citation-box` (mirror comps) |
| `app/not-found.tsx` | Korean links to 서재, 글, 연재 |

---

### 9. Assets & metadata

| Item | Action |
|------|--------|
| Favicon | Add `app/icon.ico` or `public/favicon.ico` |
| `public/vercel.svg` etc. | Remove unused defaults if not referenced |
| Home OG | Keep root metadata; optional Korean description update |

---

## Suggested PR order

1. **PR1 — Chrome:** Korean nav + footer + `lib/site.ts` — **done**  
2. **PR2 — Home:** Hero illustration + headline + flagship series panel + 연재 서가 — **done**  
3. **PR3 — Reading:** Essay detail (meta, citation, siblings) — **done**  
4. **PR4 — Series:** Volume pages + TOC — **done**  
5. **PR5 — About:** Scholar record page — **done**  
6. **PR6 — Polish:** Essays catalogue index, 404, lint/build (optional)

Each PR: `npm run lint && npm run build` before merge.

---

## Testing checklist

- [ ] Home: illustration loads (`priority`), alt text present, responsive stack on mobile  
- [ ] Home: flagship series resolves; empty state if slug missing  
- [ ] Nav: all four Korean labels route correctly; focus styles intact  
- [ ] Essays: drafts hidden; catalogue sort by date desc  
- [ ] Essay: breadcrumb series link works; citation copies  
- [ ] Series: Korean slug URLs work; TOC links to essays  
- [ ] About: all sections render; 서재 안내 collapsed by default  
- [ ] No regression: existing MDX essays build via `generateStaticParams`  
- [ ] Lighthouse: no layout shift from hero image (width/height on `Image`)

---

## Content dependencies (non-blocking)

| Item | Owner | Notes |
|------|-------|-------|
| Final About biography | Professor | Replace placeholders |
| Flagship series confirmation | Professor | Default `형벌과 사회` |
| Custom illustration | Professor / designer | May replace SVG |
| Author name for citations | Professor | e.g. citation byline |

---

## Explicit non-goals (Phase 1)

- Supabase, auth, admin routes  
- `featured` / recent home sections (removed by design)  
- `content/series/*.md` (optional 1.5)  
- JSON-LD, print CSS, OG images (Phase 2)

---

## Reference files during implementation

| Doc | Use |
|-----|-----|
| `design/comps/archive-comps.html` | Visual truth for spacing and copy |
| `design/comps/HOME-HERO-SPEC.md` | Hero constraints |
| `design/DESIGN-PROPOSAL.md` | Approved scope |
| `.cursor/rules/criminal-law-archive.mdc` | Agent conventions |
