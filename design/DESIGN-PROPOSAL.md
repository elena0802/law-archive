# Design Proposal — Criminal Law Archive

**Status:** Approved (scholarly warmth direction)  
**Scope:** Public site refresh · MDX content unchanged · No CMS in this phase

---

## Brand positioning

| Position as | Not as |
|-------------|--------|
| **One scholar's study** (한 학자의 서재) | A legal blog |
| A lifetime of scholarship, reflection, and teaching | A content catalogue |
| A dignified digital legacy | A publication homepage or content platform |

**Experience goal:** Entering a scholar's study — not browsing an archive index.

**References:** The New Yorker · Aeon · Long Now · Second Season Project

---

## Design principles

**Use:** generous whitespace · calm typography (Noto Serif KR / Noto Sans KR) · restrained hierarchy · academic tone · warm paper palette (`#f8f4ea`, `#68462d` accent)

**Avoid:** flashy gradients · aggressive CTAs · startup aesthetics · social engagement patterns · stock photography · corporate portraits

---

## Information architecture (approved)

| Route | Korean nav | Role |
|-------|------------|------|
| `/` | 서재 | Study entrance — hero + 연재 서가 |
| `/essays` | 글 | Bibliographic catalogue (registry rows) |
| `/essays/[slug]` | — | Essay reading + citation + series context |
| `/series` | 연재 | Series index (volumes) |
| `/series/[slug]` | — | Series volume + numbered 목차 |
| `/about` | 서재 소개 | Scholar record + archive mission |

**Removed from home:** “Recent essays” feed · English nav labels · blog-style card grids on entrance

**Preserved:** MDX in `content/essays/` · `lib/essays.ts` data layer · series derived from frontmatter · draft / featured semantics · static-friendly routes

---

## Home page

### Hero — scholarly warmth (approved)

The hero combines:

1. **Study-centered illustration** — books, notes, desk, lamp, quiet atmosphere; optional side caricature. Represents the **scholar's world**, not the scholar's face.
2. **Human charter copy** — approved headline and warm lead.
3. **Flagship series** — labeled **「지금 읽는 연재」**, compact intro + 목차 (not the sole emotional anchor).

**Headline (approved):**

```
형사법을 연구하며
사람과 사회를 생각해 왔습니다.
```

Rationale: humanistic · beyond doctrine alone · lifetime of inquiry · connects law, people, society · supports future essays on ethics, society, AI, education, reflection.

**Layout (desktop):** two columns — illustration (~45%) | charter + series panel (~55%), on `paper-muted` band with rules, no marketing hero.

**Layout (mobile):** illustration → headline → lead → series panel.

### Below hero (unchanged intent)

- **연재 서가** — volume list (2-col on wide), quiet link to all series
- No featured/recent card stacks duplicating blog patterns

---

## Essay detail

- Breadcrumb: `연재 › {series}`
- Meta: category · date · reading time · optional part N/M
- Deck (description) distinct from `.archive-prose` body
- **인용** block (copy-friendly Korean citation)
- **같은 연재** sibling links

---

## Series detail

- Curator **introduction** (not auto-generated count string only)
- **목차** as numbered catalogue rows (date · title), not `ArticleCard` stack
- Sort: ascending by date default (pedagogical flow; confirm at build)

---

## About (`/about`)

Sections (approved):

1. 학력 및 약력  
2. 연구 분야  
3. 주요 저서 및 논문  
4. 학술 연표  
5. 이 서재에 대하여  
6. 서재 안내 (collapsed — editor workflow, de-emphasized)

Placeholder copy in comps until final biography is supplied.

---

## Visual assets

| Asset | Path (design) | Production (Phase 1) |
|-------|---------------|-------------------------|
| Study illustration | `design/comps/hero-study-editorial.png` | `public/images/hero-study.png` (editorial watercolor, not line art) |
| Hi-fi comps | `design/comps/archive-comps.html` | Reference only |
| Hero spec | `design/comps/HOME-HERO-SPEC.md` | — |

Optional: replace SVG with professor-approved sketch; keep same frame and layout.

---

## Out of scope (this phase)

- Supabase CMS / admin UI  
- Content model migration off MDX  
- Search, comments, newsletter, analytics widgets  
- OG image generation (Phase 2 candidate)

---

## Comps & specs

- Interactive: `design/comps/archive-comps.html`  
- Hero detail: `design/comps/HOME-HERO-SPEC.md`  
- Implementation: `design/PHASE-1-IMPLEMENTATION.md`
