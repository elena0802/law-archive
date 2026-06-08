# Criminal Law Archive Analytics Dashboard

**Status:** Internal specification (PR52.4)  
**Data sources:** Google Analytics 4, Microsoft Clarity  
**Scope:** Public site routes only (`(site)` layout). Admin CMS routes are excluded from tracking.

This document is the **review layer** for analytics already collected in production. It does not introduce a new analytics product, database, or in-app dashboard.

**Production variables:**

| Variable | Tool |
|----------|------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity |

**Review cadence:** Weekly (Clarity + GA4 spot-check). Formal readout after each two-week public-sharing window (see [Public Sharing Evaluation](#public-sharing-evaluation)).

---

## Reach

**Where to read:** GA4 → Reports → Acquisition / User attributes, or Home overview.

| Metric | Definition |
|--------|------------|
| **Users** | Distinct visitors in the period |
| **Sessions** | Total visits (one user may have multiple sessions) |
| **New Users** | First-time visitors in the period |

Use the same date range for all three. Prefer **28-day rolling** for monthly rhythm; use **7-day** for weekly pulse checks.

### Targets (monthly, public site)

| Level | Users | Sessions | New Users |
|-------|------:|---------:|----------:|
| **Minimum Success** | 80+ | 120+ | 50+ |
| **Good Signal** | 250+ | 400+ | 150+ |
| **Strong Signal** | 600+ | 1,000+ | 350+ |

### Interpretation

- **Minimum Success** — The archive is findable and receiving steady, non-trivial traffic beyond immediate contacts. Worth maintaining.
- **Good Signal** — Organic discovery or referral is working; readership is forming around essays and series.
- **Strong Signal** — The site is acting as a durable public surface for the scholar’s work, not only a private repository.

Low reach with high engagement (see below) can still be **positive** for a scholarly archive. Reach alone is not the primary success criterion.

---

## Reading Engagement

**Where to read:** GA4 → Reports → Engagement → Pages and screens; Engagement overview (Average engagement time per session, Views per session).

| Metric | Definition |
|--------|------------|
| **Average Engagement Time** | Mean active time per engaged session (not total session length) |
| **Views per Session** | Screen/page views divided by sessions |

Long-form essays and series should drive these metrics. Home and index pages count but matter less in isolation.

### Target ranges (monthly)

| Level | Avg. engagement time / session | Views / session |
|-------|----------------------------------|-----------------|
| **Minimum Success** | 1:30 – 2:30 | 1.8 – 2.2 |
| **Good Signal** | 2:30 – 5:00 | 2.5 – 3.5 |
| **Strong Signal** | 5:00+ | 3.5+ |

### Interpretation

- **High engagement time, low views/session** — Deep reading of one essay; typical for academic visitors.
- **Moderate engagement time, high views/session** — Browsing across series, categories, or research list; exploratory behavior.
- **Low engagement time, high reach** — Landing without reading; check acquisition source and first landing page in Clarity.
- **Low engagement time, low reach** — Distribution or first-impression problem before content quality can be judged.

Compare essay URLs individually in GA4 when a series launch or share campaign runs.

---

## Scholar Validation

**Where to read:** GA4 → Explore or Pages report, filtered to `/research` and `/research/[number]`.

| Metric | Definition |
|--------|------------|
| **Research Page Views** | Total views of `/research` and individual research record pages |
| **Research Page View Rate** | Research visitors ÷ total visitors (same period) |

### Formula

```
Research Page View Rate = Research Visitors / Total Visitors
```

- **Research Visitors** — Users with at least one view of `/research` or `/research/*` in the period.
- **Total Visitors** — All users on the public site in the same period.

Compute in GA4 Explore (segment or path filter) or export and calculate manually. Do not double-count paths outside `/research`.

### Target ranges (monthly)

| Level | Research page views | Research page view rate |
|-------|--------------------:|------------------------:|
| **Minimum Success** | 30+ | 8% – 12% |
| **Good Signal** | 100+ | 15% – 22% |
| **Strong Signal** | 250+ | 25%+ |

### Interpretation

This block answers: **Are visitors evaluating the scholar, not only skimming a single essay?**

- **Rising research views with flat total users** — Existing readers deepening trust; strong scholarly signal.
- **High essay traffic, near-zero research rate** — Content is spreading but the author’s corpus and credentials are not yet part of the visit.
- **High research rate on low traffic** — Small, serious audience (typical early stage); pair with engagement time before judging reach.

---

## Community Engagement

**Where to read:** GA4 → Reports → Engagement → Events. Custom events are implemented in production only.

| Event | Fired when |
|-------|------------|
| `guestbook_created` | Guestbook entry submitted successfully |
| `comment_created` | Essay comment submitted successfully |
| `newsletter_subscribed` | Newsletter subscription succeeds (not duplicate/error) |
| `search_used` | Search submitted with a non-empty query (footer or `/search`) |

### Interpretation by event

| Event | What it indicates | Healthy pattern | Caution |
|-------|-------------------|-----------------|---------|
| **guestbook_created** | Personal connection to the scholar; trust and warmth | Steady low volume after about/guestbook shares | Spikes without context may be spam—review entries in admin |
| **comment_created** | Readers engaging with specific essays | Correlates with long essay engagement time | Many views, zero comments is normal for a scholarly archive; not a failure |
| **newsletter_subscribed** | Intent to return when new writing is published | Grows after series posts or email mentions | Duplicate errors are excluded by design; do not count as success |
| **search_used** | Active intent to find topics across the archive | Rises as catalog grows | High search with low result clicks may indicate gaps in findability or labeling |

### Event volume guidance (monthly, indicative)

There is no “viral” target. For this archive, **any non-zero organic community events** on top of reading metrics count as validation.

| Level | Combined custom events / month | Notes |
|-------|-------------------------------:|-------|
| **Minimum Success** | 3+ total across all four | At least one channel of participation |
| **Good Signal** | 15+ total, or 2+ types active | Reading + light participation |
| **Strong Signal** | 40+ total, or 3+ types active | Archive functioning as a living study, not a static PDF shelf |

---

## Clarity Review Checklist

**Where to read:** [Microsoft Clarity](https://clarity.microsoft.com/) → Dashboard, Recordings, Heatmaps.  
**Cadence:** Weekly, 20–30 minutes.

1. **Do users visit Research?**  
   - Heatmaps on `/research` and top `/research/[number]` pages.  
   - Funnel: Home or essay → Research.

2. **Do users reach comments?**  
   - Scroll depth on `/essays/[slug]`.  
   - Recordings: do readers reach the comment block after the article body?

3. **Do users use search?**  
   - Cross-check `search_used` in GA4 with Clarity sessions on `/search` and footer search usage.

4. **Where do users abandon?**  
   - Dead clicks, quick backs, and exit pages on home, essay list, and long essays.  
   - Note mobile vs desktop if split is visible.

5. **What pages create the most engagement?**  
   - Clarity “engagement” / popular pages vs GA4 engagement time.  
   - Flag essays and series that hold attention for future promotion or cross-linking.

**Weekly log (one line each):** date, top entry page, top exit page, one Clarity insight, one action (or “no action”).

---

## Public Sharing Evaluation

**When:** After each **two-week** window following intentional public sharing (link in signature, society newsletter, social post, etc.).

Collect from GA4 + Clarity for that 14-day window only. Classify the period holistically—not on a single metric.

### Dimensions to summarize

| Dimension | Primary sources |
|-----------|-----------------|
| **Total visitors** | GA4 Users / Sessions |
| **Engagement** | Avg. engagement time, views/session, top essays |
| **Research interest** | Research page views, research page view rate |
| **Community participation** | Counts for all four custom events |

### Classification

#### Weak Signal

- Reach below **Minimum Success** *and* average engagement time below 1:30.  
- Research page view rate under 5%.  
- Zero community events *and* no meaningful Clarity evidence of scroll-through on essays.  
- **Meaning:** Share may not have reached the right audience, or the landing experience did not invite reading. Adjust channel or highlight one flagship essay/series before the next push.

#### Positive Signal

- Reach at or above **Minimum Success**, *or* reach modest but engagement/research metrics at **Good** level.  
- At least one custom event type or clear Clarity path into comments/research.  
- **Meaning:** The archive is reaching the right kind of reader. Continue steady publishing and light sharing; no product changes required.

#### Strong Signal

- Reach at **Good Signal** or better *with* engagement at **Good** or better.  
- Research page view rate at **Good** or better, or essay depth clearly visible in Clarity.  
- Multiple community event types or repeat visitors in GA4.  
- **Meaning:** Public sharing is working; the site supports both scholarship and community. Consider a follow-up share focused on research or a flagship series.

---

## Quick reference: GA4 vs Clarity

| Question | Use first |
|----------|-----------|
| How many people came? | GA4 |
| How long did they read? | GA4 |
| Did custom actions happen? | GA4 Events |
| Where did they click, scroll, rage-click? | Clarity |
| Why did they leave an essay? | Clarity Recordings |

---

## Document maintenance

- Update target tables once **six months** of production data exist, using actual baselines instead of estimates.  
- When new public routes or events are added, extend the Community Engagement table and Clarity checklist in the same PR as the tracking change.  
- Do not add in-app analytics UI without a separate product decision; this file remains the internal dashboard.
