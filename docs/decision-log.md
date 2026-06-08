# Decision Log

Record **important product decisions** and the reasoning behind them. This is not a changelog. Link to `docs/product-learning-log.md` for observations; use this file when a choice was made and alternatives were rejected.

---

## 2026-06-08

### Decision

Install GA4 and Microsoft Clarity on public routes **before** the first AI Wow Moment ships, and document KPI review in `docs/analytics-dashboard.md`.

### Alternatives Considered

- Wait until AI launch, then add analytics in the same release.
- Build an in-app analytics dashboard instead of using GA4 + Clarity.
- Track admin CMS routes together with the public site.

### Why This Decision

The professor began sharing the site earlier than planned. Pre-AI traffic is real usage, not a pilot to discard. External tools match the “no new analytics system” constraint. Public-only tracking keeps CMS noise out of reader metrics.

### Expected Outcome

A measurable **Before AI vs After AI** baseline for reach, reading engagement, research interest, and community events (`guestbook_created`, `comment_created`, `newsletter_subscribed`, `search_used`).

### Review Later

After the first two-week sharing window and again after AI Wow Moment launch: did baseline data make comparison possible, and were targets in `analytics-dashboard.md` realistic?

---

## 2026-05-18

### Decision

Ship **Newsletter MVP**: email subscribe on the public site, Supabase subscriber storage, token-based unsubscribe, and admin broadcast—not a full marketing suite.

### Alternatives Considered

- Defer newsletter until CMS Phase 3 or a dedicated email product.
- Use a third-party newsletter platform only (no on-site subscribe).
- Launch with send-only (no unsubscribe/duplicate handling).

### Why This Decision

The archive is long-form and episodic; a lightweight “new essay” channel fits the professor’s publishing rhythm without turning the site into a media outlet. Supabase aligns with existing CMS data. Unsubscribe and duplicate protection are minimum trust requirements.

### Expected Outcome

Readers who finish an essay or visit the home page can opt in with low friction. `newsletter_subscribed` becomes a community-engagement signal in analytics.

### Review Later

Is subscription volume sufficient to justify broadcast effort? Do subscribers correlate with series readers vs. one-time visitors?

---

## 2026-05-22

### Decision

Add **Guestbook Reply**: the professor can reply to an 안부의 글 entry from admin; replies render inline under the original message.

### Alternatives Considered

- Leave guestbook as write-only with no public response.
- Open threaded public replies between visitors (comment-style).
- Handle replies only by private email, not on the site.

### Why This Decision

The guestbook is a personal bridge to the scholar, not a forum. A single authoritative reply preserves dignity and calm tone while acknowledging visitors. Admin-only authoring matches the retired-professor-as-host model.

### Expected Outcome

Warmer retention on `/guestbook` and visible proof that messages are read. Moderation stays simple (one reply per entry, professor-controlled).

### Review Later

Do replies increase new guestbook submissions or return visits? Any pressure to allow visitor-to-visitor threads?

---

## 2026-06-08

### Decision

Make **Scholar DNA + Academic Life Story** the first **AI Wow Moment** experiment—not a generic chatbot or open-ended AI search.

### Alternatives Considered

- General-purpose “ask the archive” AI chat on every page.
- AI writing assistant in admin only (no public Wow Moment).
- Delay all AI until traffic proves PMF on static content alone.
- Lead with automated essay summaries or SEO snippets.

### Why This Decision

Early sharing showed peers care about *who* the scholar is and *how* a career in criminal law fits together—not tooling for its own sake. Scholar DNA and Academic Life Story support shareability among professors (“how did you make this?”) while staying aligned with 한 학자의 서재. User-generated **academic self-interpretation** may produce stronger wow than passive reading.

### Expected Outcome

Higher research-page view rate and engagement depth among academic visitors; increased peer-to-peer sharing in 학계 circles. AI value is tested against the Before AI baseline.

### Review Later

Does the experiment lift Clarity scroll on about/research paths and GA4 research metrics without breaking editorial calm? Which output drives “어떻게 이런 걸 만들었나요?” reactions most often?
