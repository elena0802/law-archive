# Home hero — approved spec

**Status:** Approved for Phase 1  
**Brand:** One scholar's study — not a legal blog or content platform

---

## Feeling

| Target | Avoid |
|--------|--------|
| A lifetime of scholarship, reflection, and teaching | A content catalogue or publication homepage |
| Entering a scholar's study | Browsing an archive index |

---

## Structure (IA unchanged)

- Korean nav: 서재 · 글 · 연재 · 서재 소개  
- Hero: illustration + charter + 「지금 읽는 연재」  
- Below: **연재 서가** → link to all series  
- No recent-post feed

---

## Visual

**Study-centered illustration** — scholar's world, not scholar's face.

| Include | Exclude |
|---------|---------|
| Books, notes, manuscripts | Corporate portraits |
| Writing desk, desk lamp | Startup-style hero |
| Quiet study atmosphere | Generic stock photography |
| Optional side caricature (line art) | Marketing imagery, face-forward photos |

**Asset:** Editorial watercolor — `public/images/hero-study.png` (source: `design/comps/hero-study-editorial.png`)  
**Not:** schematic SVG / icon-style line art  
**Frame:** thin `border-line`, `object-cover` to fill ~48% hero column on desktop  
**Alt (KO):** 책상 램프 아래 글을 쓰는 학자와 책, 원고가 있는 서재를 담은 수채화 일러스트

---

## Copy (approved)

**Eyebrow:** 디지털 서재

**Headline:**

```
형사법을 연구하며
사람과 사회를 생각해 왔습니다.
```

**Lead (default — single source in `lib/site.ts`):**

> 오랜 세월 강의실과 서재 사이를 오가며 남긴 질문들입니다. 책상 위 메모와 판례 속의 문장처럼, 이곳에는 형사법을 가르치고 글쓰던 한 학자의 생각이 차분히 놓입니다. 빠른 논평보다 오래 남을 사유를 위해 기록합니다.

**Series block label:** 지금 읽는 연재  
**Flagship series (default):** 형벌과 사회  
**CTA style:** text link with underline (`연재 읽기`) — not a button

---

## Layout

### Desktop (≥ 960px)

```
┌─────────────────────────┬──────────────────────────────┐
│  [Illustration + caption] │  eyebrow + H1 + lead         │
│                           │  ─────────────────────────   │
│                           │  지금 읽는 연재               │
│                           │  {series title}              │
│                           │  intro · meta · link · toc   │
└─────────────────────────┴──────────────────────────────┘
```

- Band: `bg-paper-muted`, top/bottom `border-line`  
- Grid: ~45% visual / ~55% text (`max-w-wide`)

### Mobile

1. Illustration (max-height capped)  
2. Headline + lead  
3. Series panel  

---

## Comps

- `archive-comps.html` (서재 tab)  
- `png/comp-home-archive-v2.png` (mood reference)
