# Design comps & documentation

| Document | Purpose |
|----------|---------|
| [`../DESIGN-PROPOSAL.md`](../DESIGN-PROPOSAL.md) | Approved design scope |
| [`../PHASE-1-IMPLEMENTATION.md`](../PHASE-1-IMPLEMENTATION.md) | Build plan (no CMS) |
| [`HOME-HERO-SPEC.md`](HOME-HERO-SPEC.md) | Approved home hero |

Visual references for the archive refresh (not wired into the Next.js app until Phase 1).

## Interactive comps (recommended)

Open in a browser for pixel-accurate Korean type and exact design tokens:

```bash
open design/comps/archive-comps.html
```

- **서재** — Home with study-desk illustration + warm charter + flagship series (“지금 읽는 연재”)
- **글 상세** — Essay reading page
- **연재 상세** — Series volume / TOC
- **서재 소개** — Scholar biography page

Tokens match `app/globals.css`: paper `#f8f4ea`, ink `#1d1a15`, accent `#68462d`, Noto Serif KR / Noto Sans KR.

## Static reference images

Exported mood comps (AI-generated, approximate):

- `png/comp-home-archive.png` (v1)
- `png/comp-home-archive-v2.png` (v2 — scholar hero; when generated)
- `hero-study-editorial.png` — approved watercolor editorial hero art
- `hero-study-illustration.svg` — deprecated line-art placeholder (do not use)
- `HOME-HERO-SPEC.md` — hero revision spec
- `assets/comp-essay-archive.png`
- `assets/comp-series-archive.png`
- `assets/comp-about-archive.png`

Use the HTML comps for implementation handoff; use PNGs for stakeholder presentations.
